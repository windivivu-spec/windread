import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { asMoney, asText, asUuid, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";

function nullableText(value: unknown, max = 300) {
  if (typeof value !== "string" || !value.trim()) return null;
  return asText(value, "Nội dung", { max });
}

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const branchId = request.nextUrl.searchParams.get("branchId");
    if (branchId) assertBranchAccess(context, branchId);
    const service = createServiceClient();
    let products = service.from("products").select("id,branch_id,sku,name,sale_price,cost_price,stock_on_hand,reorder_level,unit,is_active,product_categories(name),suppliers(name)").order("name").limit(200);
    let services = service.from("services").select("id,branch_id,name,description,price,price_label,service_category,duration_minutes,is_bookable").order("name").limit(200);
    let packages = service.from("service_packages").select("id,branch_id,name,sale_price,description,is_active,service_package_items(quantity,service_id)").order("name").limit(100);
    let suppliers = service.from("suppliers").select("id,name,phone,email,address,note").order("name").limit(100);
    if (branchId) {
      products = products.eq("branch_id", branchId);
      services = services.eq("branch_id", branchId);
      packages = packages.eq("branch_id", branchId);
    } else if (context.role !== "admin") {
      products = products.in("branch_id", context.branchIds);
      services = services.in("branch_id", context.branchIds);
      packages = packages.in("branch_id", context.branchIds);
    }
    const [productResult, serviceResult, packageResult, supplierResult] = await Promise.all([products, services, packages, suppliers]);
    for (const result of [productResult, serviceResult, packageResult, supplierResult]) if (result.error) throw result.error;
    return NextResponse.json({ products: productResult.data ?? [], services: serviceResult.data ?? [], packages: packageResult.data ?? [], suppliers: supplierResult.data ?? [] });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const body = await bodyJson(request);
    const action = asText(body.action, "Thao tác", { max: 40 });
    const service = createServiceClient();

    if (action === "product") {
      const branchId = asText(body.branchId, "Chi nhánh", { max: 80 });
      assertBranchAccess(context, branchId);
      const product = {
        branch_id: branchId,
        sku: asText(body.sku, "Mã sản phẩm", { max: 80 }),
        name: asText(body.name, "Tên sản phẩm", { max: 160 }),
        sale_price: asMoney(body.salePrice, "Giá bán"),
        cost_price: asMoney(body.costPrice ?? 0, "Giá vốn"),
        stock_on_hand: asMoney(body.openingStock ?? 0, "Tồn đầu"),
        reorder_level: asMoney(body.reorderLevel ?? 0, "Mức tồn tối thiểu"),
        unit: nullableText(body.unit, 24) ?? "sp"
      };
      const { data, error } = await service.from("products").insert(product).select().single();
      if (error) throw error;
      if (product.stock_on_hand > 0) {
        const { error: movementError } = await service.from("inventory_movements").insert({
          product_id: data.id,
          branch_id: branchId,
          kind: "opening",
          quantity_delta: product.stock_on_hand,
          unit_cost: product.cost_price,
          note: "Tồn kho khi tạo sản phẩm",
          created_by: context.id
        });
        if (movementError) throw movementError;
      }
      return NextResponse.json({ product: data }, { status: 201 });
    }

    if (action === "supplier") {
      const { data, error } = await service
        .from("suppliers")
        .insert({ name: asText(body.name, "Tên nhà cung cấp", { max: 160 }), phone: nullableText(body.phone, 32), email: nullableText(body.email, 160), address: nullableText(body.address, 300), note: nullableText(body.note, 500) })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ supplier: data }, { status: 201 });
    }

    if (action === "package") {
      const branchId = asText(body.branchId, "Chi nhánh", { max: 80 });
      assertBranchAccess(context, branchId);
      const { data, error } = await service
        .from("service_packages")
        .insert({ branch_id: branchId, name: asText(body.name, "Tên gói", { max: 160 }), sale_price: asMoney(body.salePrice, "Giá gói"), description: nullableText(body.description, 600) })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ package: data }, { status: 201 });
    }

    if (action === "stock") {
      const productId = asUuid(body.productId, "Sản phẩm");
      const quantity = Number(body.quantity);
      if (!Number.isSafeInteger(quantity) || quantity === 0) throw new Error("Số lượng điều chỉnh không hợp lệ.");
      const { data: product, error: productError } = await service.from("products").select("id,branch_id,stock_on_hand").eq("id", productId).single();
      if (productError) throw productError;
      assertBranchAccess(context, product.branch_id);
      if (product.stock_on_hand + quantity < 0) throw new Error("Không thể điều chỉnh tồn kho xuống dưới 0.");
      const { error: updateError } = await service.from("products").update({ stock_on_hand: product.stock_on_hand + quantity }).eq("id", productId);
      if (updateError) throw updateError;
      const { error: movementError } = await service.from("inventory_movements").insert({ product_id: productId, branch_id: product.branch_id, kind: "adjustment", quantity_delta: quantity, note: asText(body.note, "Lý do điều chỉnh", { max: 300 }), created_by: context.id });
      if (movementError) throw movementError;
      return NextResponse.json({ ok: true });
    }

    throw new Error("Thao tác danh mục không được hỗ trợ.");
  } catch (error) {
    return adminErrorResponse(error);
  }
}

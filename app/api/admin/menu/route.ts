import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { asMoney, asText, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";
import { groupServicesForDisplay } from "../../../booking/servicePresentation";
import type { Service } from "../../../booking/types";

const serviceCategories = ["barber", "dreadlocks", "braids", "afro"] as const;
type ServiceCategory = (typeof serviceCategories)[number];
type MenuServiceRow = {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  price: number;
  price_label: string | null;
  service_category: ServiceCategory | null;
  duration_minutes: number;
  is_price_visible: boolean;
  is_bookable: boolean;
  menu_order: number | null;
};

function toService(row: MenuServiceRow): Service {
  return {
    id: row.id,
    branchId: row.branch_id,
    name: row.name,
    description: row.description,
    price: row.price,
    priceLabel: row.price_label ?? undefined,
    category: row.service_category ?? "barber",
    durationMinutes: row.duration_minutes,
    menuOrder: row.menu_order ?? undefined
  };
}

function nullableText(value: unknown, max = 160) {
  if (typeof value !== "string" || !value.trim()) return null;
  return asText(value, "Thông tin", { max });
}

function serviceFields(body: Record<string, unknown>) {
  const category = asText(body.category, "Nhóm dịch vụ", { max: 24 });
  if (!serviceCategories.includes(category as ServiceCategory)) throw new Error("Nhóm dịch vụ không hợp lệ.");
  if (typeof body.isPriceVisible !== "boolean") throw new Error("Trạng thái hiển thị bảng giá không hợp lệ.");
  if (typeof body.isBookable !== "boolean") throw new Error("Trạng thái dịch vụ không hợp lệ.");
  if (body.isBookable && !body.isPriceVisible) throw new Error("Dịch vụ đặt lịch phải được hiển thị trên bảng giá.");
  return {
    name: asText(body.name, "Tên dịch vụ", { max: 120 }),
    description: asText(body.description, "Mô tả", { max: 600 }),
    price: asMoney(body.price, "Giá dịch vụ"),
    price_label: nullableText(body.priceLabel, 80),
    service_category: category,
    duration_minutes: asMoney(body.durationMinutes, "Thời lượng", { min: 1 }),
    is_price_visible: body.isPriceVisible,
    is_bookable: body.isBookable
  };
}

function serviceId(branchId: string, name: string) {
  const branchPrefix = branchId === "chuong-duong" ? "cd" : branchId === "an-thuong" ? "an" : "svc";
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42) || "service";
  return `${branchPrefix}-${slug}-${randomUUID().slice(0, 8)}`;
}

async function branchBarberIds(service: ReturnType<typeof createServiceClient>, branchId: string) {
  const { data, error } = await service.from("barbers").select("id").eq("branch_id", branchId);
  if (error) throw error;
  return (data ?? []).map((barber) => barber.id);
}

async function enableServiceMappings(service: ReturnType<typeof createServiceClient>, id: string, branchId: string) {
  const barberIds = await branchBarberIds(service, branchId);
  if (!barberIds.length) throw new Error("Chi nhánh chưa có barber để nhận dịch vụ này.");

  const { data, error } = await service.from("barber_services").select("barber_id").eq("service_id", id);
  if (error) throw error;
  const mapped = new Set((data ?? []).map((row) => row.barber_id));
  const missing = barberIds.filter((barberId) => !mapped.has(barberId));
  if (missing.length) {
    const { error: mappingError } = await service.from("barber_services").insert(missing.map((barber_id) => ({ barber_id, service_id: id })));
    if (mappingError) throw mappingError;
  }
}

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin"]);
    const branchId = request.nextUrl.searchParams.get("branchId");
    if (branchId && branchId !== "all") assertBranchAccess(context, branchId);

    const service = createServiceClient();
    let query = service.from("services").select("id,branch_id,name,description,price,price_label,service_category,duration_minutes,is_price_visible,is_bookable,menu_order");
    if (branchId && branchId !== "all") query = query.eq("branch_id", branchId);
    const { data, error } = await query.order("branch_id");
    if (error) throw error;
    const rows = (data ?? []) as MenuServiceRow[];
    const branchIds = [...new Set(rows.map((row) => row.branch_id))];
    const ordered: Array<MenuServiceRow & { menu_group: string; menu_position: number }> = [];
    for (const currentBranchId of branchIds) {
      const branchRows = rows.filter((row) => row.branch_id === currentBranchId);
      for (const group of groupServicesForDisplay(branchRows.map(toService), false)) {
        group.services.forEach((item, index) => {
          const row = branchRows.find((candidate) => candidate.id === item.id);
          if (row) ordered.push({ ...row, menu_group: group.label, menu_position: index });
        });
      }
    }
    return NextResponse.json({ services: ordered });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin"]);
    const body = await bodyJson(request);
    const action = asText(body.action, "Thao tác", { max: 24 });
    const branchId = asText(body.branchId, "Chi nhánh", { max: 80 });
    assertBranchAccess(context, branchId);
    const service = createServiceClient();

    if (action === "reorder") {
      const category = asText(body.category, "Nhóm dịch vụ", { max: 24 });
      if (!serviceCategories.includes(category as ServiceCategory)) throw new Error("Nhóm dịch vụ không hợp lệ.");
      if (!Array.isArray(body.serviceIds) || body.serviceIds.some((id) => typeof id !== "string")) {
        throw new Error("Danh sách thứ tự không hợp lệ.");
      }
      const serviceIds = body.serviceIds as string[];
      if (new Set(serviceIds).size !== serviceIds.length) throw new Error("Danh sách dịch vụ bị trùng.");
      const { data: allBranchRows, error: siblingsError } = await service
        .from("services")
        .select("id,branch_id,name,description,price,price_label,service_category,duration_minutes,is_price_visible,is_bookable,menu_order")
        .eq("branch_id", branchId);
      if (siblingsError) throw siblingsError;
      const allRows = (allBranchRows ?? []) as MenuServiceRow[];
      const target = allRows.find((row) => row.service_category === category && serviceIds.includes(row.id));
      if (!target) throw new Error("Không tìm thấy nhóm dịch vụ cần sắp xếp.");
      const siblingGroup = groupServicesForDisplay(allRows.filter((row) => row.service_category === category).map(toService), false)
        .find((group) => group.services.some((item) => item.id === target.id));
      const currentIds = (siblingGroup?.services ?? []).map((item) => item.id).sort();
      if (JSON.stringify([...serviceIds].sort()) !== JSON.stringify(currentIds)) {
        throw new Error("Menu vừa thay đổi. Tải lại trang rồi thử lại.");
      }
      const results = await Promise.all(serviceIds.map((id, index) =>
        service.from("services").update({ menu_order: index * 10 }).eq("id", id).eq("branch_id", branchId)
      ));
      const failed = results.find((result) => result.error);
      if (failed?.error) throw failed.error;
      return NextResponse.json({ ok: true });
    }

    const fields = serviceFields(body);
    if (action === "create") {
      const { data: lastService, error: orderError } = await service
        .from("services")
        .select("menu_order")
        .eq("branch_id", branchId)
        .eq("service_category", fields.service_category)
        .order("menu_order", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      if (orderError) throw orderError;

      const id = serviceId(branchId, fields.name);
      const { data: created, error: createError } = await service
        .from("services")
        .insert({ ...fields, id, branch_id: branchId, is_bookable: false, menu_order: Math.max(lastService?.menu_order ?? 1000, 1000) + 10 })
        .select("id,branch_id,name,description,price,price_label,service_category,duration_minutes,is_price_visible,is_bookable,menu_order")
        .single();
      if (createError) throw createError;

      try {
        if (fields.is_bookable) await enableServiceMappings(service, id, branchId);
        const { data, error } = await service
          .from("services")
          .update({ is_bookable: fields.is_bookable })
          .eq("id", id)
          .select("id,branch_id,name,description,price,price_label,service_category,duration_minutes,is_price_visible,is_bookable,menu_order")
          .single();
        if (error) throw error;
        return NextResponse.json({ service: data }, { status: 201 });
      } catch (error) {
        await service.from("barber_services").delete().eq("service_id", id);
        await service.from("services").delete().eq("id", id);
        throw error;
      }
    }

    if (action === "update") {
      const id = asText(body.id, "Dịch vụ", { max: 100 });
      const { data: current, error: currentError } = await service
        .from("services")
        .select("id,branch_id,is_price_visible,is_bookable")
        .eq("id", id)
        .eq("branch_id", branchId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) return NextResponse.json({ message: "Không tìm thấy dịch vụ trong chi nhánh." }, { status: 404 });

      if (fields.is_bookable) await enableServiceMappings(service, id, branchId);
      const { data, error } = await service
        .from("services")
        .update(fields)
        .eq("id", id)
        .eq("branch_id", branchId)
        .select("id,branch_id,name,description,price,price_label,service_category,duration_minutes,is_price_visible,is_bookable,menu_order")
        .single();
      if (error) throw error;
      if (!fields.is_bookable) {
        const { error: mappingError } = await service.from("barber_services").delete().eq("service_id", id);
        if (mappingError) throw mappingError;
      }
      return NextResponse.json({ service: data });
    }

    throw new Error("Thao tác menu không được hỗ trợ.");
  } catch (error) {
    return adminErrorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { adminErrorResponse, allowedBranches, requireAdminContext } from "../../../../lib/admin/auth";

export async function GET() {
  try {
    const context = await requireAdminContext();
    const branches = await allowedBranches(context);
    return NextResponse.json({
      user: {
        id: context.id,
        displayName: context.displayName,
        role: context.role,
        barberId: context.barberId,
        branchIds: context.branchIds
      },
      branches
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

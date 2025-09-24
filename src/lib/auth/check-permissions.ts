import { currentUser } from "@clerk/nextjs/server";
import { getUserGroupPermissions } from "@/lib/cache/permissions-cache";
import { redirect } from "next/navigation";

export async function checkPagePermission(
  group: string,
  permission: string = "Listar"
) {
  const user = await currentUser();

  const permissions: string[] = await getUserGroupPermissions(
    user?.id || "",
    group
  );

  const hasPermission = permissions.includes(permission);

  if (!hasPermission) {
    redirect("/portal/unauthorized");
  }

  return permissions;
}

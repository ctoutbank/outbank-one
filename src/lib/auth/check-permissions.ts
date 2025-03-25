import { currentUser } from "@clerk/nextjs/server";
import { getUserGroupPermissions } from "@/features/users/server/users";
import { redirect } from "next/navigation";

export async function checkPagePermission(
  group: string,
  permission: string = "Ver lista"
) {
  const user = await currentUser();
  console.log("user", user);
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

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import ProfileForm from "@/features/my-profile/_components/my-profile-form";
import { getUserById } from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { currentUser } from "@clerk/nextjs/server";

export const revalidate = 0;

export default async function MyProfilePage() {
  await checkPagePermission("Gereciamento de conta");

  const user = await currentUser();

  const myProfile = await getUserById(user?.id || "");

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Meu Perfil", url: "/portal/myProfile" }]}
      />
      <BaseBody title="Meu Perfil" subtitle={"Editar Perfil"}>
        <ProfileForm profile={myProfile || undefined} />
      </BaseBody>
    </>
  );
}

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import ProfilesForm from "@/features/users/_components/profiles-form";
import {
  getModules,
  getProfileById,
  ModuleSelect,
} from "@/features/users/server/profiles";

export const revalidate = 300;

export default async function PaymentLinkDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const profileId = parseInt(resolvedParams.id);
  const profile = await getProfileById(profileId);
  const modules: ModuleSelect[] = await getModules(profileId || undefined);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Perfil", url: "/portal/users" }]}
      />
      <BaseBody
        title="Perfis"
        subtitle={profile?.id ? "Editar Perfil" : "Adicionar Perfil"}
      >
        <ProfilesForm
          profile={profile}
          availableModules={modules}
        ></ProfilesForm>
      </BaseBody>
    </>
  );
}

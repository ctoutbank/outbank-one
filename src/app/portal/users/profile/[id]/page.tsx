import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import ProfilesForm from "@/features/users/_components/profiles-form";
import {
  getModules,
  getProfileById,
  ModuleSelect,
} from "@/features/users/server/profiles";

export const revalidate = 0;

export default async function PaymentLinkDetail({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getProfileById(parseInt(params.id));
  const modules: ModuleSelect[] = await getModules();

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

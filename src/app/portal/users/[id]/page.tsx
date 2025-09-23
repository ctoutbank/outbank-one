import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import UserForm from "@/features/users/_components/users-form";
import {
  getDDProfiles,
  getUserById,
} from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const permissions = await checkPagePermission(
    "Configurar Perfis e Usuários",
    "Gerenciador"
  );

  const userId = resolvedParams.id;
  const user = await getUserById(userId);
  const DDProfiles = await getDDProfiles();

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Usuários", url: "/portal/users" }]}
      />
      <BaseBody
        title="Usuários"
        subtitle={user?.id ? "Editar Usuário" : "Adicionar Usuário"}
      >
        <UserForm
          user={user || undefined}
          profiles={DDProfiles}
        
          permissions={permissions}
        />
      </BaseBody>
    </>
  );
}

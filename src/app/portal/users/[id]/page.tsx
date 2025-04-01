import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import UserForm from "@/features/users/_components/users-form";
import {
  getDDCustomers,
  getDDMerchants,
  getDDProfiles,
  getUserById,
} from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

export default async function UserDetail({
  params,
}: {
  params: { id: string };
}) {
  const permissions = await checkPagePermission(
    "Configurar Perfis e Usuários",
    "Gerenciador"
  );

  const userId = params.id;
  const user = await getUserById(userId);
  const DDProfiles = await getDDProfiles();
  const DDMerchants = await getDDMerchants();
  const DDCustomers = await getDDCustomers();

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
          merchants={DDMerchants}
          customers={DDCustomers}
          permissions={permissions}
        />
      </BaseBody>
    </>
  );
}

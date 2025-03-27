import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import UserForm from "@/features/users/_components/users-form";
import {
  getDDCustomers,
  getDDMerchants,
  getDDProfiles,
  getUserById,
} from "@/features/users/server/users";

export const revalidate = 0;

export default async function UserDetail({
  params,
}: {
  params: { id: string };
}) {
  const ddMerchant = await getDDMerchants();
  const ddProfile = await getDDProfiles();
  const ddCustomer = await getDDCustomers();
  const user = await getUserById(params.id);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Usuários", url: "/portal/users" }]}
      />
      <BaseBody
        title="Usuário"
        subtitle={params?.id ? "Editar Usuário" : "Adicionar Usuário"}
      >
        <UserForm
          customers={ddCustomer}
          merchants={ddMerchant}
          profiles={ddProfile}
          user={user == null ? undefined : user}
        />
      </BaseBody>
    </>
  );
}

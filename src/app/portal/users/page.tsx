import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import UserTabs from "@/features/users/_components/user-tabs";
import { getProfiles } from "@/features/users/server/profiles";
import {
  getDDCustomers,
  getDDMerchants,
  getDDProfiles,
  getUsers,
} from "@/features/users/server/users";

export const revalidate = 0;

type UsersPageProps = {
  page: string;
  pageSize: string;
  email: string;
  firstName: string;
  lastName: string;
  tab: string;
  profile: string;
  profileName: string;
  merchant: string;
  customer: string;
  name: string; // For profile search
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: UsersPageProps;
}) {
  const page = Number.parseInt(searchParams.page || "1");
  const pageSize = Number.parseInt(searchParams.pageSize || "10");
  const email = searchParams.email || "";
  const firstName = searchParams.firstName || "";
  const lastName = searchParams.lastName || "";
  const activeTab = searchParams.tab || "users";
  const profileId = searchParams.profileName || "0";
  const customerId = searchParams.customer || "0";
  const merchantId = searchParams.merchant || "0";
  const profileName = searchParams.name || "";

  const users = await getUsers(
    email,
    firstName,
    lastName,
    Number(profileId),
    Number(customerId),
    Number(merchantId),
    page,
    pageSize
  );

  const profiles = await getProfiles(profileName, page, pageSize);
  const DDCustomer = await getDDCustomers();
  const DDProfile = await getDDProfiles();
  const DDMerchant = await getDDMerchants();

  const totalUsersRecords = users.totalCount;
  const totalProfilesRecords = profiles.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          {
            title:
              activeTab == "users" ? "Gestão de Usuários" : "Gestão de Perfis",
            url: "/portal/users",
          },
        ]}
      />

      <BaseBody
        title={activeTab == "users" ? "Gestão de Usuários" : "Gestão de Perfis"}
        subtitle={
          activeTab == "users"
            ? "Visualização de todos os Usuários"
            : "Visualização de todos os Perfis"
        }
      >
        <UserTabs
          users={users}
          profiles={profiles}
          DDCustomer={DDCustomer}
          DDProfile={DDProfile}
          DDMerchant={DDMerchant}
          totalUsersRecords={totalUsersRecords}
          totalProfilesRecords={totalProfilesRecords}
          page={page}
          pageSize={pageSize}
          email={email}
          firstName={firstName}
          lastName={lastName}
          activeTab={activeTab}
          profileId={profileId}
          customerId={customerId}
          merchantId={merchantId}
          profileName={profileName}
        />
      </BaseBody>
    </>
  );
}

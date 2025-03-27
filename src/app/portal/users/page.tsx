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
import { cache } from "react";

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
};

// Envolvendo as funções em cache
const getCachedUsers = cache(getUsers);
const getCachedProfiles = cache(getProfiles);
const getCachedDDCustomers = cache(getDDCustomers);
const getCachedDDProfiles = cache(getDDProfiles);
const getCachedDDMerchants = cache(getDDMerchants);

// Componentes separados para cada tab
async function UsersTabContent({
  email,
  firstName,
  lastName,
  profile,
  customer,
  merchant,
  page,
  pageSize,
}: UsersPageProps) {
  const users = await getCachedUsers(
    email,
    firstName,
    lastName,
    Number(profile),
    Number(customer),
    Number(merchant),
    Number(page),
    Number(pageSize)
  );
  const DDCustomer = await getCachedDDCustomers();
  const DDProfile = await getCachedDDProfiles();
  const DDMerchant = await getCachedDDMerchants();

  return { users, DDCustomer, DDProfile, DDMerchant };
}

async function ProfilesTabContent({
  profileName,
  page,
  pageSize,
}: {
  profileName: string;
  page: number;
  pageSize: number;
}) {
  const profiles = await getCachedProfiles(profileName, page, pageSize);
  return { profiles };
}

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
  const profileId = searchParams.profile || "0";
  const customerId = searchParams.customer || "0";
  const merchantId = searchParams.merchant || "0";
  const profileName = searchParams.profileName || "";

  let usersData, profilesData;

  if (activeTab === "users") {
    usersData = await UsersTabContent({
      email,
      firstName,
      lastName,
      profile: profileId,
      customer: customerId,
      merchant: merchantId,
      page: page.toString(),
      pageSize: pageSize.toString(),
      tab: activeTab,
      profileName: profileName,
    });
    profilesData = { profiles: { items: [], totalCount: 0 } }; // dados vazios
  } else {
    profilesData = await ProfilesTabContent({ profileName, page, pageSize });
    usersData = {
      users: { items: [], totalCount: 0 },
      DDCustomer: [],
      DDProfile: [],
      DDMerchant: [],
    }; // dados vazios
  }

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
          users={usersData.users}
          profiles={profilesData.profiles}
          DDCustomer={usersData.DDCustomer || []}
          DDProfile={usersData.DDProfile || []}
          DDMerchant={usersData.DDMerchant || []}
          totalUsersRecords={usersData.users?.totalCount || 0}
          totalProfilesRecords={profilesData.profiles?.totalCount || 0}
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

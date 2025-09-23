import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import UserTabs from "@/features/users/_components/user-tabs";
import { getProfiles } from "@/features/users/server/profiles";
import {
  getDDMerchants,
  getDDProfiles,
  getUsers,
} from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { cache } from "react";

export const revalidate = 300;

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
  sortBy?: string;
  sortOrder?: string;
};

const getCachedUsers = cache(getUsers);
const getCachedProfiles = cache(getProfiles);
const getCachedDDProfiles = cache(getDDProfiles);
const getCachedDDMerchants = cache(getDDMerchants);

// Componentes separados para cada tab
async function UsersTabContent({
  email,
  firstName,
  lastName,
  profile,
  page,
  pageSize,
}: UsersPageProps) {
  const users = await getCachedUsers(
    email,
    firstName,
    lastName,
    Number(profile),
    Number(page),
    Number(pageSize)
  );
  const DDProfile = await getCachedDDProfiles();
  const DDMerchant = await getCachedDDMerchants();

  return { users, DDProfile, DDMerchant };
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
  searchParams: Promise<UsersPageProps>;
}) {
  const permissions = await checkPagePermission("Configurar Perfis e Usuários");

  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams.page || "1");
  const pageSize = Number.parseInt(resolvedSearchParams.pageSize || "10");
  const email = resolvedSearchParams.email || "";
  const firstName = resolvedSearchParams.firstName || "";
  const lastName = resolvedSearchParams.lastName || "";
  const activeTab = resolvedSearchParams.tab || "users";
  const profileId = resolvedSearchParams.profile || "0";
  const customerId = resolvedSearchParams.customer || "0";
  const merchantId = resolvedSearchParams.merchant || "0";
  const profileName = resolvedSearchParams.profileName || "";
  const sortBy = resolvedSearchParams.sortBy || "id";
  const sortOrder =
    resolvedSearchParams.sortOrder === "asc" || resolvedSearchParams.sortOrder === "desc"
      ? resolvedSearchParams.sortOrder
      : "desc";

  console.log(permissions);

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
      sortBy,
      sortOrder,
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
            ? "Visualização de Todos os Usuários"
            : "Visualização de Todos os Perfis"
        }
      >
        <UserTabs
          users={usersData.users}
          profiles={profilesData.profiles}
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
          merchantId={merchantId}
          profileName={profileName}
          permissions={permissions}
        />
      </BaseBody>
    </>
  );
}

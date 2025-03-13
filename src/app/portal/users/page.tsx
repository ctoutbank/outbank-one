import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileFilter } from "@/features/users/_components/filter-profile";
import ProfilesList from "@/features/users/_components/profiles-list";
import { UserFilter } from "@/features/users/_components/user-filter";
import UsersList from "@/features/users/_components/users-list";
import { getProfiles } from "@/features/users/server/profiles";
import {
  getDDCustomers,
  getDDMerchants,
  getDDProfiles,
  getUsers,
} from "@/features/users/server/users";
import { Search } from "lucide-react";

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
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="border-b w-full justify-start rounded-none h-12 bg-transparent p-0 mb-6">
            <TabsTrigger
              value="users"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-12 px-6 font-medium"
            >
              Usuários
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-12 px-6 font-medium"
            >
              Perfis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            <div className="mb-4">
              <UserFilter
                customer={customerId}
                customerOptions={DDCustomer}
                email={email}
                firstName={firstName}
                lastName={lastName}
                merchant={merchantId}
                merchantOptions={DDMerchant}
                newButtonLabel="Novo Usuário"
                newButtonUrl="/portal/users/0"
                profile={profileId}
                profileOptions={DDProfile}
                showNewButton={true}
              />
            </div>

            {totalUsersRecords > 0 ? (
              <div>
                <UsersList users={users} />
                <PaginationRecords
                  totalRecords={totalUsersRecords}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/users"
                />
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title={"Nenhum resultado encontrado"}
                description={""}
              ></EmptyState>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <div className="mb-4">
              <ProfileFilter
                showNewButton={true}
                newButtonLabel="Novo Perfil"
                newButtonUrl="/portal/users/profile/0"
                profileName={profileName}
              />
            </div>
            <ProfilesList></ProfilesList>
            {totalProfilesRecords > 0 && (
              <div>
                <PaginationRecords
                  totalRecords={totalProfilesRecords}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/users"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </BaseBody>
    </>
  );
}

"use client";

import { EmptyState } from "@/components/empty-state";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileFilter } from "@/features/users/_components/filter-profile";
import ProfilesList from "@/features/users/_components/profiles-list";
import { UserFilter } from "@/features/users/_components/user-filter";
import UsersList from "@/features/users/_components/users-list";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface UserTabsProps {
  users: any;
  profiles: any;
  DDCustomer: any[];
  DDProfile: any[];
  DDMerchant: any[];
  totalUsersRecords: number;
  totalProfilesRecords: number | undefined;
  page: number;
  pageSize: number;
  email: string;
  firstName: string;
  lastName: string;
  activeTab: string;
  profileId: string;
  customerId: string;
  merchantId: string;
  profileName: string;
  permissions?: string[];
}

export default function UserTabs({
  users,
  profiles,
  DDCustomer,
  DDProfile,
  DDMerchant,
  totalUsersRecords,
  totalProfilesRecords,
  page,
  pageSize,
  email,
  firstName,
  lastName,
  activeTab,
  profileId,
  customerId,
  merchantId,
  profileName,
  permissions,
}: UserTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear all search params
    Array.from(params.keys()).forEach((key) => {
      params.delete(key);
    });

    params.set("tab", value);
    router.replace(`/portal/users?${params.toString()}`);
  };

  return (
    <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="profile">Perfis</TabsTrigger>
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
            showNewButton={permissions?.includes("Gerenciador")}
          />
        </div>

        {totalUsersRecords > 0 ? (
          <div>
            <UsersList users={users} permissions={permissions} />
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
          />
        )}
      </TabsContent>

      <TabsContent value="profile" className="mt-0">
        <div className="mb-4">
          <ProfileFilter
            showNewButton={permissions?.includes("Gerenciador")}
            newButtonLabel="Novo Perfil"
            newButtonUrl="/portal/users/profile/0"
            profileName={profileName}
          />
        </div>
        <ProfilesList profileList={profiles} permissions={permissions} />
        {totalProfilesRecords && totalProfilesRecords > 0 && (
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
  );
}

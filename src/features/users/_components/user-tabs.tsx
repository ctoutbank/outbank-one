"use client";

import { EmptyState } from "@/components/empty-state";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileFilter } from "@/features/users/_components/filter-profile";
import ProfilesList from "@/features/users/_components/profiles-list";
import { UserFilter } from "@/features/users/_components/user-filter";
import UsersList from "@/features/users/_components/users-list";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
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
    const params = new URLSearchParams(searchParams?.toString());

    // Clear all search params
    Array.from(params.keys()).forEach((key) => {
      params.delete(key);
    });

    params.set("tab", value);
    router.replace(`/portal/users?${params.toString()}`);
  };

  return (
    <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center justify-start gap-4 w-full">
          <div>
            {activeTab === "users" ? (
              <UserFilter
                customer={customerId}
                customerOptions={DDCustomer}
                email={email}
                firstName={firstName}
                lastName={lastName}
                merchant={merchantId}
                merchantOptions={DDMerchant}
                profile={profileId}
                profileOptions={DDProfile}
              />
            ) : (
              <ProfileFilter profileName={profileName} />
            )}
          </div>
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="profile">Perfis</TabsTrigger>
          </TabsList>
        </div>
        <div>
          {permissions?.includes("Gerenciador") &&
            (activeTab === "users" ? (
              <Button asChild className="shrink-0">
                <Link href={"/portal/users/0"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Link>
              </Button>
            ) : (
              <Button asChild className="shrink-0">
                <Link href={"/portal/users/profile/0"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Perfil
                </Link>
              </Button>
            ))}
        </div>
      </div>

      <TabsContent value="users" className="mt-0">
        {totalUsersRecords > 0 ? (
          <div>
            <UsersList users={users} permissions={permissions} />
            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                currentPageSize={pageSize}
                pageName="portal/users"
              />
              <PaginationRecords
                totalRecords={totalUsersRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/users"
              />
            </div>
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

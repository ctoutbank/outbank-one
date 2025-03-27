"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProfile, type ProfileList } from "../server/profiles";

interface ProfilesListProps {
  profileList: ProfileList;
}

export default function ProfilesList({ profileList }: ProfilesListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const profile = profileList.profiles;
  const handleDelete = async (profileId: number) => {
    try {
      setIsDeleting(profileId);
      await deleteProfile(profileId);
    } catch (error) {
      console.error("Error deleting profile:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      <div className="grid gap-4">
        {profile?.map((profile) => (
          <Card key={profile.id}>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {profile.name}
                    {profile.name.includes("[PADRÃO]") && (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Padrão
                      </span>
                    )}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/portal/users/profile/${profile.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(profile.id)}
                      className="text-destructive"
                      disabled={isDeleting === profile.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting === profile.id ? "Excluindo..." : "Excluir"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
              {profile.functions.length > 0 && (
                <Tabs
                  defaultValue={profile.functions[0].id.toString()}
                  className="w-full"
                >
                  <TabsList className="mb-4">
                    {profile.functions?.map((module) => (
                      <TabsTrigger key={module.id} value={module.id.toString()}>
                        {module.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {profile.functions?.map((module) => (
                    <TabsContent
                      key={module.id}
                      value={module.id.toString()}
                      className="mt-0"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {module.group?.map((group) => (
                          <Card key={group.id} className="overflow-hidden">
                            <CardHeader className="p-3 pb-1">
                              <h4 className="font-medium text-sm">
                                {group.id}
                              </h4>
                            </CardHeader>
                            <CardContent className="p-3 pt-1">
                              <div className="flex flex-wrap gap-1">
                                {group.functions?.map((func) => (
                                  <span
                                    key={func.id}
                                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                                  >
                                    {func.name}
                                  </span>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

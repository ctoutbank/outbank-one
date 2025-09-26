import { PageHeader } from "@/components/layout/portal/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileForm from "@/features/my-profile/_components/my-profile-form";
import { getUserById } from "@/features/users/server/users";
import { currentUser } from "@clerk/nextjs/server";

export const revalidate = 300;

export default async function MyProfilePage() {
  const user = await currentUser();
  const myProfile = await getUserById(user?.id || "");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais e de segurança."
      />
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>
            Atualize seu nome, e-mail e outras informações aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={myProfile || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
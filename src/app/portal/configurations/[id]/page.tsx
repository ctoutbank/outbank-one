import { ConfigurationForm } from "@/features/configuration/components/configuration-form";
import { getConfigurationById } from "@/features/configuration/server/configuration";
import { notFound } from "next/navigation";

interface EditConfigurationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditConfigurationPage({
  params,
}: EditConfigurationPageProps) {
  const resolvedParams = await params;
  const configuration = await getConfigurationById(Number(resolvedParams.id));

  if (!configuration) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Configuration</h1>
      <ConfigurationForm
        initialData={{
          id: configuration.id,
          url: configuration.url || undefined,
          slug: configuration.slug || undefined,
          active: configuration.active || undefined,
          dtinsert: configuration.dtinsert
            ? new Date(configuration.dtinsert)
            : undefined,
          dtupdate: configuration.dtupdate
            ? new Date(configuration.dtupdate)
            : undefined,
          lockCpAnticipationOrder:
            configuration.lockCpAnticipationOrder || undefined,
          lockCnpAnticipationOrder:
            configuration.lockCnpAnticipationOrder || undefined,
        }}
        isEditing
      />
    </div>
  );
}

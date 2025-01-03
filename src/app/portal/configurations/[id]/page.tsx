import { ConfigurationForm } from "@/features/configuration/components/configuration-form";
import { getConfigurationById } from "@/features/configuration/server/configuration";
import { notFound } from "next/navigation";

interface EditConfigurationPageProps {
  params: {
    id: string;
  };
}

export default async function EditConfigurationPage({
  params,
}: EditConfigurationPageProps) {
  const configuration = await getConfigurationById(Number(params.id));

  if (!configuration) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Configuration</h1>
      <ConfigurationForm initialData={configuration} isEditing />
    </div>
  );
}

import { ConfigurationForm } from "@/features/configuration/components/configuration-form";

export default function NewConfigurationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">New Configuration</h1>
      <ConfigurationForm />
    </div>
  );
}

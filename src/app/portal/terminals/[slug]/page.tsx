import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import TerminalDetails from "@/features/terminals/_components/terminal-details";
import { getTerminalById } from "@/features/terminals/serverActions/terminal";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function TerminalDetail({
  params,
}: {
  params: { slug: string };
}) {
  await checkPagePermission("Terminais");

  const terminal = await getTerminalById(params.slug);

  if (!terminal) {
    notFound();
  }

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Terminais", url: "/portal/terminals" }]}
      />
      <BaseBody title="Terminal" subtitle="Detalhes do terminal">
        <TerminalDetails terminal={terminal} />
      </BaseBody>
    </>
  );
}

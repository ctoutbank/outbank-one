import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import TerminalDetails from "@/features/terminals/_components/terminal-details";
import { TerminalNotFoundToast } from "@/features/terminals/_components/terminal-not-found-toast";
import { getTerminalById } from "@/features/terminals/serverActions/terminal";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

export default async function TerminalDetail({
  params,
}: {
  params: { slug: string };
}) {
  await checkPagePermission("Terminais");

  const terminal = await getTerminalById(params.slug);

  if (!terminal) {
    return <TerminalNotFoundToast />;
  }

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Terminais", url: "/portal/terminals" }]}
      />
      <BaseBody title="Terminal" subtitle="Detalhes do Terminal">
        <TerminalDetails terminal={terminal} />
      </BaseBody>
    </>
  );
}

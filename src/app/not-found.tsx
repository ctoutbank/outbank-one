import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileQuestion className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Página não encontrada</h2>
      </div>
      <p className="text-muted-foreground">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}

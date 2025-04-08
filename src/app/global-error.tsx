"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Erro Crítico</h2>
          </div>
          <p className="text-muted-foreground">
            {error.message || "Ocorreu um erro crítico na aplicação."}
          </p>
          <Button onClick={reset} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </body>
    </html>
  );
}

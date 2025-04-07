"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
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
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Algo deu errado!</h2>
      </div>
      <p className="text-muted-foreground">
        {error.message || "Ocorreu um erro inesperado."}
      </p>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </div>
  );
}

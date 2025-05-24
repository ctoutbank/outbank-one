"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { DocumentUploadContent } from "./_components/document-upload-content";

export default function PricingSolicitationExample() {
  const [solicitationId, setSolicitationId] = useState<number | null>(null);

  // Dados de exemplo para criar uma nova solicitação
  const exampleData = {
    cnae: "12345678",
    mcc: "1234",
    cnpjQuantity: 1,
    description: "Solicitação de exemplo criada pela página de demonstração",
    status: "SEND_SOLICITATION",
    monthlyPosFee: 99.9,
    averageTicket: 150.0,
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Solicitação de Precificação</h1>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
            <CardDescription>
              {solicitationId
                ? `Solicitação #${solicitationId} em andamento`
                : "Nenhuma solicitação foi criada ainda. Ao enviar documentos, uma nova solicitação será criada automaticamente."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!solicitationId && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4">
                  Ao fazer upload de documentos sem uma solicitação existente, o
                  sistema criará automaticamente uma nova solicitação com os
                  dados padrão.
                </p>
                <Button
                  onClick={() => setSolicitationId(123)}
                  className="mr-2"
                  variant="outline"
                >
                  Simular ID existente
                </Button>
                <Button
                  onClick={() => setSolicitationId(null)}
                  variant="destructive"
                >
                  Remover ID
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Componente de upload de documentos */}
        <DocumentUploadContent
          solicitationId={solicitationId}
          pricingSolicitationData={exampleData}
        />
      </div>
    </div>
  );
}

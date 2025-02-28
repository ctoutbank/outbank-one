"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Definindo valores padrão para as variáveis de ambiente
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "file-upload-outbank";

// Verificando se as credenciais estão definidas
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.warn("AWS credentials not properly configured. File uploads may fail.");
}

// Criando o cliente S3
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

console.log("s3Client", s3Client);

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const merchantId = formData.get("merchantId") as string;

    if (!file) {
      throw new Error("Nenhum arquivo foi fornecido");
    }

    if (!merchantId) {
      throw new Error("MerchantId não foi fornecido");
    }

    // Verificar se o bucket está definido
    if (!AWS_BUCKET_NAME) {
      throw new Error("AWS_BUCKET_NAME não está definido nas variáveis de ambiente");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = `merchants/${merchantId}/documents/${file.name}`;
    
    console.log("Iniciando upload para S3:", {
      bucket: AWS_BUCKET_NAME,
      key,
      fileType: file.type,
      fileSize: buffer.length
    });

    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    console.log("Upload concluído com sucesso");

    return { success: true, key };
  } catch (error) {
    console.error("Erro detalhado ao fazer upload do arquivo:", error);
    throw error;
  }
}

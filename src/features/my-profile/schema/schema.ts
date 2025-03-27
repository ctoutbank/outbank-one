import { z } from "zod";

export const profileSchema = z
  .object({
    id: z.number().optional(),
    firstName: z
      .string()
      .min(2, { message: "O primeiro nome deve ter pelo menos 2 caracteres" }),
    lastName: z
      .string()
      .min(2, { message: "O segundo nome deve ter pelo menos 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se um dos campos de senha estiver preenchido, todos devem estar
      const hasCurrentPassword = !!data.currentPassword;
      const hasNewPassword = !!data.newPassword;
      const hasConfirmPassword = !!data.confirmPassword;

      if (hasCurrentPassword || hasNewPassword || hasConfirmPassword) {
        return hasCurrentPassword && hasNewPassword && hasConfirmPassword;
      }

      return true;
    },
    {
      message:
        "Todos os campos de senha devem ser preenchidos para alterar a senha",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar se as senhas coincidem
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar complexidade da senha
      if (data.newPassword) {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(data.newPassword);
      }
      return true;
    },
    {
      message:
        "A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais",
      path: ["newPassword"],
    }
  );

export type ProfileFormValues = z.infer<typeof profileSchema>;

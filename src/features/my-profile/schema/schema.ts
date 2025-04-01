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
      // Validar comprimento mínimo
      if (data.newPassword && data.newPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: "A senha deve ter pelo menos 8 caracteres",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar letra maiúscula
      if (data.newPassword && !/[A-Z]/.test(data.newPassword)) {
        return false;
      }
      return true;
    },
    {
      message: "A senha deve conter pelo menos uma letra maiúscula",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar letra minúscula
      if (data.newPassword && !/[a-z]/.test(data.newPassword)) {
        return false;
      }
      return true;
    },
    {
      message: "A senha deve conter pelo menos uma letra minúscula",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar número
      if (data.newPassword && !/\d/.test(data.newPassword)) {
        return false;
      }
      return true;
    },
    {
      message: "A senha deve conter pelo menos um número",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar caractere especial
      if (data.newPassword && !/[@$!%*?&]/.test(data.newPassword)) {
        return false;
      }
      return true;
    },
    {
      message: "A senha deve conter pelo menos um caractere especial (@$!%*?&)",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Validar se não é igual à senha atual
      if (
        data.newPassword &&
        data.currentPassword &&
        data.newPassword === data.currentPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: "A nova senha não pode ser igual à senha atual",
      path: ["newPassword"],
    }
  );

export type ProfileFormValues = z.infer<typeof profileSchema>;

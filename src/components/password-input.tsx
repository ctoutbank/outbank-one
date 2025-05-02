"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface PasswordInputProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: (value: string, isValid: boolean) => void;
  value?: string;
}

export function PasswordInput({
  id = "password",
  name = "password",
  label = "Senha",
  placeholder = "Digite sua senha",
  className = "",
  required = false,
  onChange,
  value: externalValue,
}: PasswordInputProps) {
  const [password, setPassword] = useState(externalValue || "");
  const [showPassword, setShowPassword] = useState(false);

  // Regras de validação
  const validations = [
    {
      id: "length",
      label: "Pelo menos 8 caracteres",
      isValid: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "Pelo menos uma letra maiúscula",
      isValid: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "Pelo menos uma letra minúscula",
      isValid: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "Pelo menos um número",
      isValid: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "Pelo menos um caractere especial",
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  // Verificar se todas as validações passaram
  const isValid = validations.every((validation) => validation.isValid);

  // Calcular a força da senha (0-5)
  const strength = validations.filter(
    (validation) => validation.isValid
  ).length;

  // Atualizar o valor e notificar o componente pai quando a senha mudar
  useEffect(() => {
    if (onChange) {
      onChange(password, isValid);
    }
  }, [password, isValid, onChange]);

  // Sincronizar com valor externo se fornecido
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== password) {
      setPassword(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={password}
          onChange={handleChange}
          className={`pr-10 ${className}`}
          required={required}
        />

        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {password && (
        <>
          {/* Indicador de força da senha */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  strength >= level
                    ? strength === 1
                      ? "bg-red-500"
                      : strength === 2
                      ? "bg-orange-500"
                      : strength === 3
                      ? "bg-yellow-500"
                      : strength === 4
                      ? "bg-green-400"
                      : "bg-green-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Lista de requisitos */}
          <div className="text-sm space-y-1 mt-2">
            {validations.map((validation) => (
              <div key={validation.id} className="flex items-center gap-2">
                {validation.isValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={
                    validation.isValid ? "text-green-700" : "text-gray-500"
                  }
                >
                  {validation.label}
                </span>
              </div>
            ))}

            {/* Aviso sobre senhas comprometidas */}
            <div className="flex items-center gap-2 mt-2 border-t pt-2">
              <div className="text-amber-600 text-xs">
                <p>
                  <strong>Observação:</strong> Mesmo senhas que atendem a todos
                  os requisitos acima podem ser rejeitadas se forem encontradas
                  em vazamentos de dados conhecidos. Nesse caso, tente uma senha
                  mais única.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

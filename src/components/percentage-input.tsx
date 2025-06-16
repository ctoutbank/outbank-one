import React from "react";

interface PercentageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled,
}) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue = e.target.value;
    // Remove qualquer símbolo de %
    newValue = newValue.replace(/%/g, "");
    // Permitir apenas números, vírgula e ponto
    newValue = newValue.replace(/[^\d.,]/g, "");
    // Trocar pontos por vírgula
    newValue = newValue.replace(/\./g, ",");
    // Garantir apenas uma vírgula
    const parts = newValue.split(",");
    if (parts.length > 2) {
      newValue = parts[0] + "," + parts.slice(1).join("");
    }
    onChange(newValue);
  }

  return (
    <div className="relative w-full flex items-center justify-center">
      <input
        type="text"
        value={value ? `${value}%` : ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
    </div>
  );
};

export { PercentageInput };

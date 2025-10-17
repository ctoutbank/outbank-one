export const formatBRL = (valueInCents: number) => (valueInCents).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
}
    )
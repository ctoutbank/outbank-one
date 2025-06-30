export const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMEX: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    CABAL: "/cabal.svg",
  };
  return cardMap[cardName] || "";
};

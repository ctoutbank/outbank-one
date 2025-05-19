export interface FeeData {
  id: string;
  code: string;
  description: string;
  type: string;
  count: number;
  feeDetails: BandeiraFeeDetails[];
}

export interface BandeiraFeeDetails {
  bandeira: string;
  bandeiraImage: string;
  modos: ModoFeeDetails[];
}

export interface ModoFeeDetails {
  modo: string;
  cartaoPresente: {
    composicao: {
      transacao: string;
      antecipacao: string;
    };
    taxaIntermediacao: string;
  };
  cartaoNaoPresente: {
    composicao: {
      transacao: string;
      antecipacao: string;
    };
    taxaIntermediacao: string;
  };
}

export interface PixFeeDetails {
  mdr: string;
  custoMinimo: string;
  custoMaximo: string;
}

export interface CardFeeDetails {
  mdr: string;
  custoMinimo: string;
  custoMaximo: string;
}

export const mockFeeData: FeeData[] = [
  {
    id: "1",
    code: "6202300",
    description:
      "DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR CUSTOMIZÁVEIS (10)",
    type: "Antecipação Compulsória",
    count: 12,
    feeDetails: [
      {
        bandeira: "VISA",
        bandeiraImage: "/visa.svg",
        modos: [
          {
            modo: "Crédito à Vista",
            cartaoPresente: {
              composicao: {
                transacao: "2,00 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "3,60 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "2,07 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "3,67 %",
            },
          },
          {
            modo: "Crédito Parcelado (2 a 6 vezes)",
            cartaoPresente: {
              composicao: {
                transacao: "2,43 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,03 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "2,53 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,13 %",
            },
          },
          {
            modo: "Crédito Parcelado (7 a 12 vezes)",
            cartaoPresente: {
              composicao: {
                transacao: "3,30 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,90 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "3,39 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,99 %",
            },
          },
          {
            modo: "Débito",
            cartaoPresente: {
              composicao: {
                transacao: "0,98 %",
                antecipacao: "-",
              },
              taxaIntermediacao: "0,98 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "0,98 %",
                antecipacao: "-",
              },
              taxaIntermediacao: "0,98 %",
            },
          },
          {
            modo: "Voucher",
            cartaoPresente: {
              composicao: {
                transacao: "4,00 %",
                antecipacao: "-",
              },
              taxaIntermediacao: "4,00 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "4,00 %",
                antecipacao: "-",
              },
              taxaIntermediacao: "4,00 %",
            },
          },
          {
            modo: "Pré-Pago",
            cartaoPresente: {
              composicao: {
                transacao: "1,20 %",
                antecipacao: "-",
              },
              taxaIntermediacao: "1,20 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "1,20 %",
                antecipacao: "-",
              },
              taxaIntermediacao: "1,20 %",
            },
          },
        ],
      },
      {
        bandeira: "MASTERCARD",
        bandeiraImage: "/mastercard.svg",
        modos: [
          {
            modo: "Crédito à Vista",
            cartaoPresente: {
              composicao: {
                transacao: "1,75 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "3,35 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "1,97 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "3,57 %",
            },
          },
          {
            modo: "Crédito Parcelado (2 a 6 vezes)",
            cartaoPresente: {
              composicao: {
                transacao: "2,41 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,01 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "2,68 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,28 %",
            },
          },
        ],
      },
    ],
  },
  {
    id: "2",
    code: "6202300",
    description:
      "DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR CUSTOMIZÁVEIS (20)",
    type: "Antecipação Eventual",
    count: 11,
    feeDetails: [
      {
        bandeira: "ELO",
        bandeiraImage: "/elo.svg",
        modos: [
          {
            modo: "Crédito à Vista",
            cartaoPresente: {
              composicao: {
                transacao: "2,66 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,26 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "2,66 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,26 %",
            },
          },
          {
            modo: "Crédito Parcelado (2 a 6 vezes)",
            cartaoPresente: {
              composicao: {
                transacao: "3,14 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,74 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "3,19 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,79 %",
            },
          },
        ],
      },
    ],
  },
  {
    id: "3",
    code: "4789004",
    description: "COM. VAREJISTA DE ANIMAIS (20)",
    type: "ANTECIPAÇÃO EVENTUAL",
    count: 10,
    feeDetails: [
      {
        bandeira: "AMERICAN_EXPRESS",
        bandeiraImage: "/american-express.svg",
        modos: [
          {
            modo: "Crédito à Vista",
            cartaoPresente: {
              composicao: {
                transacao: "3,05 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,65 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "3,19 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "4,79 %",
            },
          },
        ],
      },
    ],
  },
  {
    id: "4",
    code: "4731800",
    description: "POSTOS (5)",
    type: "Antecipação Compulsória",
    count: 8,
    feeDetails: [
      {
        bandeira: "HIPERCARD",
        bandeiraImage: "/hipercard.svg",
        modos: [
          {
            modo: "Crédito à Vista",
            cartaoPresente: {
              composicao: {
                transacao: "2,28 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "3,88 %",
            },
            cartaoNaoPresente: {
              composicao: {
                transacao: "2,28 %",
                antecipacao: "1,60 %",
              },
              taxaIntermediacao: "3,88 %",
            },
          },
        ],
      },
    ],
  },
  {
    id: "5",
    code: "4731800",
    description: "POSTOS (10)",
    type: "Antecipação Compulsória",
    count: 6,
    feeDetails: [],
  },
  {
    id: "6",
    code: "4731800",
    description: "POSTOS (5)",
    type: "Antecipação Eventual",
    count: 7,
    feeDetails: [],
  },
  {
    id: "7",
    code: "4731800",
    description: "POSTOS (10)",
    type: "Antecipação Eventual",
    count: 5,
    feeDetails: [],
  },
  {
    id: "8",
    code: "4731800",
    description: "POSTOS (15)",
    type: "Antecipação Compulsória",
    count: 4,
    feeDetails: [],
  },
  {
    id: "9",
    code: "4731800",
    description: "POSTOS (15)",
    type: "Antecipação Eventual",
    count: 3,
    feeDetails: [],
  },
  {
    id: "10",
    code: "4731800",
    description: "POSTOS (20)",
    type: "Antecipação Compulsória",
    count: 2,
    feeDetails: [],
  },
  {
    id: "11",
    code: "4731800",
    description: "POSTOS (20)",
    type: "Antecipação Eventual",
    count: 1,
    feeDetails: [],
  },
];

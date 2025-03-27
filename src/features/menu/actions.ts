"use server";

import { getUserGroupPermissions } from "@/features/users/server/users";
import { currentUser } from "@clerk/nextjs/server";

const getGroupFromUrl = (url: string): string => {
  const pathSegments = url.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const groupMappings: { [key: string]: string } = {
    dashboard: "Dashboard",
    merchants: "Estabelecimentos",
    terminals: "Terminais",
    transactions: "Vendas",
    edis: "Arquivo EDI",
    salesAgents: "Configurar Consultor Comercial",
    paymentLink: "Link de Pagamentos",
    anticipations: "Antecipações de Recebíveis",
    settlements: "Liquidação",
    users: "Configurar Perfis e Usuários",
    merchantAgenda: "Agenda Lojista",
    receipts: "Agenda de Antecipações",
    categories: "Categorias",
    legalNatures: "Natureza Juridica",
    history: "Liquidação",
  };

  return groupMappings[lastSegment] || lastSegment;
};

// Base menu structure
const menuData = {
  teams: [
    {
      name: "Banco Prisma",
      logo: "DollarSignIcon",
      plan: "Empresarial",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/portal/dashboard",
      icon: "PieChart",
    },
    {
      title: "Estabelecimentos",
      url: "/portal/merchants",
      icon: "HomeIcon",
    },
    {
      title: "Terminais",
      url: "/portal/terminals",
      icon: "Calculator",
    },
    {
      title: "Vendas",
      url: "/portal/transactions",
      icon: "DollarSign",
      items: [
        {
          title: "Transações",
          url: "/portal/transactions",
        },
        {
          title: "Arquivos EDI",
          url: "/portal/edis",
        },
      ],
    },
    {
      title: "Consultores Comerciais",
      url: "/portal/salesAgents",
      icon: "User",
    },
    {
      title: "Link de Pagamento",
      url: "/portal/paymentLink",
      icon: "Link",
    },
    {
      title: "Antecipações",
      url: "/portal/anticipations",
      icon: "DollarSign",
    },
    {
      title: "Liquidação",
      url: "",
      icon: "Landmark",
      items: [
        {
          title: "Hoje",
          url: "/portal/settlements",
        },
        {
          title: "Histórico",
          url: "/portal/settlements/history",
        },
      ],
    },
    {
      title: "Configurações de Conta",
      url: "",
      icon: "Bolt",
      items: [
        {
          title: "Perfis e Usuários",
          url: "/portal/users",
        },
      ],
    },
    {
      title: "Agenda dos Lojistas",
      url: "/portal/merchantAgenda",
      icon: "Check",
    },
    {
      title: "Recebimentos",
      url: "/portal/receipts",
      icon: "Check",
    },
    {
      title: "Configurações",
      url: "/portal/categories",
      icon: "Settings",
      items: [
        {
          title: "Categorias",
          url: "/portal/categories",
        },
        {
          title: "Natureza Jurídica",
          url: "/portal/legalNatures",
        },
      ],
    },
  ],
};

export async function getAuthorizedMenu() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const filteredNavMain = await Promise.all(
      menuData.navMain.map(async (item) => {
        const mainGroup = getGroupFromUrl(
          item.url || item.items?.[0]?.url || ""
        );
        const mainPermissions = await getUserGroupPermissions(
          user.id,
          mainGroup
        );
        const hasMainPermission = mainPermissions.includes("Listar");

        if (item.items) {
          const filteredItems = await Promise.all(
            item.items.map(async (subItem) => {
              const subGroup = getGroupFromUrl(subItem.url);
              const subPermissions = await getUserGroupPermissions(
                user.id,
                subGroup
              );
              return subPermissions.includes("Listar") ? subItem : null;
            })
          );

          const validItems = filteredItems.filter(
            (item): item is NonNullable<typeof item> => item !== null
          );

          if (validItems.length > 0) {
            return {
              ...item,
              items: validItems,
            };
          }
          return null;
        }

        return hasMainPermission ? item : null;
      })
    );

    const validNavMain = filteredNavMain.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    return {
      ...menuData,
      navMain: validNavMain,
    };
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
}

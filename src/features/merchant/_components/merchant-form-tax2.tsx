'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react'
import { updateMerchantPriceGroupFormAction } from "../_actions/merchantpricegroup-formActions"
import { getMerchantPriceGroupsBymerchantPricetId } from "../server/merchantpricegroup"


const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    "MASTERCARD": "/mastercard.svg",
    "VISA": "/visa.svg",
    "ELO": "/elo.svg",
    "AMEX": "/american-express.svg",
    "HIPERCARD": "/hipercard.svg",
    "CABAL": "/cabal.svg"
  };
  return cardMap[cardName] || "";
};


interface Merchantprice {
  id: number;
  name: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  tableType: string;
  slugMerchant: string;
  compulsoryAnticipationConfig: number;
  anticipationType: string;
  eventualAnticipationFee: number;
  cardPixMdr: number;
  cardPixCeilingFee: number;
  cardPixMinimumCostFee: number;
  nonCardPixMdr: number;
  nonCardPixCeilingFee: number;
  nonCardPixMinimumCostFee: number;
  merchantpricegroup: Array<{
    id: number;
    name: string;
    active: boolean;
    dtinsert: string;
    dtupdate: string;
    listMerchantTransactionPrice: Array<{
      id: number;
      slug: string;
      active: boolean;
      dtinsert: string;
      dtupdate: string;
      idMerchantPriceGroup: number;
      installmentTransactionFeeStart: number;
      installmentTransactionFeeEnd: number;
      cardTransactionMdr: number;
      cardTransactionFee: number;
      nonCardTransactionFee: number;
      nonCardTransactionMdr: number;
      producttype: string;
    }>;
  }>;
}

interface MerchantpriceList {
  merchantprice: Merchantprice[];
  
  idMerchantPrice: number;
}

type TransactionPrice = {
  id: number
  slug: string
  active: boolean
  dtinsert: string
  dtupdate: string
  idMerchantPriceGroup: bigint
  installmentTransactionFeeStart: number
  installmentTransactionFeeEnd: number
  cardTransactionMdr: number
  cardTransactionFee: number
  nonCardTransactionFee: number
  nonCardTransactionMdr: number
  producttype: string
}

type MerchantPriceGroup = {
  id: number
  name: string
  active: boolean
  dtinsert: string
  dtupdate: string
  idMerchantPrice: number
    listMerchantTransactionPrice: TransactionPrice[]
}

export default function MerchantFormTax2({
  merchantprice,
 
  idMerchantPrice
}: MerchantpriceList) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("todas");
  const [feeData, setFeeData] = useState<any[]>([]);
  const [pixFees, setPixFees] = useState({
    mdr: merchantprice[0].cardPixMdr,
    custoMinimo: merchantprice[0].cardPixMinimumCostFee,
    custoMaximo: merchantprice[0].cardPixCeilingFee,
    antecipacao: merchantprice[0].anticipationType,
  });

  

  const handlePixFeeChange = (field: keyof typeof pixFees, value: string) => {
    setPixFees({ ...pixFees, [field]: parseFloat(value) });
  };

 

  useEffect(() => {
    console.log("Todos merchantprices:", merchantprice);
    
    if (merchantprice) {
      let groupsToShow = [];
      
      switch(selectedTab) {
        case "todas":
          // Combina os grupos de todos os merchantprice
          groupsToShow = merchantprice.flatMap(mp => mp.merchantpricegroup || []);
          break;
        case "pos":
          // Filtra apenas os grupos do merchantprice do tipo POS
          const posPrice = merchantprice.find(mp => mp.tableType === "POS");
          groupsToShow = posPrice?.merchantpricegroup || [];
          break;
        case "online":
          // Filtra apenas os grupos do merchantprice do tipo ONLINE
          const onlinePrice = merchantprice.find(mp => mp.tableType === "ONLINE");
          groupsToShow = onlinePrice?.merchantpricegroup || [];
          break;
        default:
          groupsToShow = merchantprice.flatMap(mp => mp.merchantpricegroup || []);
      }
      
      const organizedData = groupsToShow.map(group => {
        const transactions = group.listMerchantTransactionPrice || [];
        return {
          ...group,
          transactions: {
            credit: {
              vista: transactions.find(tx => 
                tx.producttype === "CREDIT" && 
                tx.installmentTransactionFeeStart === 1 &&
                tx.installmentTransactionFeeEnd === 1
              ),
              parcela2_6: transactions.find(tx => 
                tx.producttype === "CREDIT" && 
                tx.installmentTransactionFeeStart === 2 &&
                tx.installmentTransactionFeeEnd === 6
              ),
              parcela7_12: transactions.find(tx => 
                tx.producttype === "CREDIT" && 
                tx.installmentTransactionFeeStart === 7 &&
                tx.installmentTransactionFeeEnd === 12
              )
            },
            debit: transactions.find(tx => tx.producttype === "DEBIT"),
            prepaid: transactions.find(tx => tx.producttype === "PREPAID")
          }
        };
      });

      console.log("Dados organizados por tab:", selectedTab, organizedData);
      setFeeData(organizedData);
    }
  }, [merchantprice, selectedTab]);

  const handleSaveChanges = async () => {
    try {
      const updatePromises = feeData.map(async (group) => {
        await updateMerchantPriceGroupFormAction({
          id: group.id,
          slug: group.name,
          active: group.active,
          brand: group.name,
          idGroup: group.id,
          idMerchantPrice: idMerchantPrice,
          dtinsert: new Date(group.dtinsert),
          dtupdate: new Date()
        });
      });

      await Promise.all(updatePromises);
      setIsEditing(false);
      const updatedGroups = await getMerchantPriceGroupsBymerchantPricetId(idMerchantPrice);
      if (updatedGroups) {
        setFeeData(updatedGroups.map(group => {
          if (!group.priceGroup) {
            return null;
          }
          return {
            id: group.priceGroup.id,
            name: group.priceGroup.brand || '',
            active: group.priceGroup.active || false,
            dtinsert: group.priceGroup.dtinsert || '',
            dtupdate: group.priceGroup.dtupdate || '',
            idMerchantPrice: group.priceGroup.idMerchantPrice || 0,
            listMerchantTransactionPrice: JSON.parse(group.transactionPrices || '[]')
          };
        }).filter((group): group is MerchantPriceGroup => group !== null));
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  

  return (
    <div className="w-full mx-auto p-4">
     

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-6 bg-black rounded flex items-center justify-center text-white text-sm">$</div>
        <h1 className="text-xl font-semibold">Taxas de Transação</h1>
      </div>

      <Tabs defaultValue="todas" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className='flex gap-4 mb-2'>
          <TabsTrigger value="todas" >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Todas as Transações
            </span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="data-[state=active]:bg-white rounded-md">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2"/>
                <path d="M8 12h8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Transações no POS
            </span>
          </TabsTrigger>
          <TabsTrigger value="online" className="data-[state=active]:bg-white rounded-md">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2"/>
              </svg>
              Transações Online
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Última Atualização: 11/12/2024 - 15h30
          </div>
          <div className="flex items-center gap-2">
           
            {isEditing ? (
              <>
                <Button 
                  variant="outline"
                  className="bg-white text-black"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                >
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <Button 
                
                onClick={() => setIsEditing(true)}
              >
                Alterar Taxas
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="todas">
          <div className="bg-gray-50 rounded-lg p-4 mb-5">
            <table className="w-full ">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                      {getCardImage(group.name) && (
                                              <img
                                                src={getCardImage(group.name)}
                                                alt={group.name}
                                                width={40}
                                                height={24}
                                                className="object-contain"
                                              />
                                            )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.vista?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.vista) {
                              newFeeData[groupIndex].transactions.credit.vista.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.vista?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela2_6?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela2_6) {
                              newFeeData[groupIndex].transactions.credit.parcela2_6.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela2_6?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela7_12?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela7_12) {
                              newFeeData[groupIndex].transactions.credit.parcela7_12.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela7_12?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.debit?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.debit) {
                              newFeeData[groupIndex].transactions.debit.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.prepaid?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.prepaid) {
                              newFeeData[groupIndex].transactions.prepaid.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.mdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Taxa Pix</h2>
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">MDR</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].cardPixMdr}
                  onChange={(e) => handlePixFeeChange('mdr', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  {merchantprice[0].cardPixMdr}%
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].cardPixMinimumCostFee}
                  onChange={(e) => handlePixFeeChange('custoMinimo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].cardPixMinimumCostFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].cardPixCeilingFee}
                  onChange={(e) => handlePixFeeChange('custoMaximo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].cardPixCeilingFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">Antecipação</p>
      {isEditing ? (
        <Input
          value={merchantprice[0].eventualAnticipationFee}
          onChange={(e) => handlePixFeeChange('antecipacao', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
          {merchantprice[0].eventualAnticipationFee}% ao mês
        </div>
      )}
    </div>
         
          </div>
        </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                      {getCardImage(group.name) && (
                                              <img
                                                src={getCardImage(group.name)}
                                                alt={group.name}
                                                width={40}
                                                height={24}
                                                className="object-contain"
                                              />
                                            )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.vista?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.vista) {
                              newFeeData[groupIndex].transactions.credit.vista.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.vista?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela2_6?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela2_6) {
                              newFeeData[groupIndex].transactions.credit.parcela2_6.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela2_6?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela7_12?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela7_12) {
                              newFeeData[groupIndex].transactions.credit.parcela7_12.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela7_12?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.debit?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.debit) {
                              newFeeData[groupIndex].transactions.debit.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.prepaid?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.prepaid) {
                              newFeeData[groupIndex].transactions.prepaid.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Taxa Pix</h2>
          <div className="flex gap-10">
            <div className="flex flex-col items-left">
              <p className="text-sm text-gray-600 mb-2">MDR</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].nonCardPixMdr}
                  onChange={(e) => handlePixFeeChange('mdr', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  {merchantprice[0].nonCardPixMdr}%
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].nonCardPixMinimumCostFee}
                  onChange={(e) => handlePixFeeChange('custoMinimo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].nonCardPixMinimumCostFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].nonCardPixCeilingFee}
                  onChange={(e) => handlePixFeeChange('custoMaximo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].nonCardPixCeilingFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
      <p className="text-sm  text-gray-600 mb-2">Antecipação</p>
      {isEditing ? (
        <Input
          value={merchantprice[0].eventualAnticipationFee}
          onChange={(e) => handlePixFeeChange('antecipacao', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
          {merchantprice[0].eventualAnticipationFee}% ao mês
        </div>
      )}
    </div>
            
         
          </div>
        </div>
          </div>
        </TabsContent>

        <TabsContent value="pos">
      
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
            <table className="w-full ">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                      {getCardImage(group.name) && (
                                              <img
                                                src={getCardImage(group.name)}
                                                alt={group.name}
                                                width={40}
                                                height={24}
                                                className="object-contain"
                                              />
                                            )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.vista?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.vista) {
                              newFeeData[groupIndex].transactions.credit.vista.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.vista?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela2_6?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela2_6) {
                              newFeeData[groupIndex].transactions.credit.parcela2_6.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela2_6?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela7_12?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela7_12) {
                              newFeeData[groupIndex].transactions.credit.parcela7_12.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela7_12?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.debit?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.debit) {
                              newFeeData[groupIndex].transactions.debit.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.prepaid?.mdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.prepaid) {
                              newFeeData[groupIndex].transactions.prepaid.mdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.mdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Taxa Pix</h2>
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">MDR</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].cardPixMdr}
                  onChange={(e) => handlePixFeeChange('mdr', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  {merchantprice[0].cardPixMdr}%
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].cardPixMinimumCostFee}
                  onChange={(e) => handlePixFeeChange('custoMinimo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].cardPixMinimumCostFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].cardPixCeilingFee}
                  onChange={(e) => handlePixFeeChange('custoMaximo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].cardPixCeilingFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">Antecipação</p>
      {isEditing ? (
        <Input
          value={merchantprice[0].eventualAnticipationFee}
          onChange={(e) => handlePixFeeChange('antecipacao', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
          {merchantprice[0].eventualAnticipationFee}% ao mês
        </div>
      )}
    </div>
            
         
          </div>
        </div>
          </div>
        </TabsContent>

        <TabsContent value="online">
        <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                      {getCardImage(group.name) && (
                                              <img
                                                src={getCardImage(group.name)}
                                                alt={group.name}
                                                width={40}
                                                height={24}
                                                className="object-contain"
                                              />
                                            )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.vista?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.vista) {
                              newFeeData[groupIndex].transactions.credit.vista.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.vista?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela2_6?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela2_6) {
                              newFeeData[groupIndex].transactions.credit.parcela2_6.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela2_6?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.parcela7_12?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.credit.parcela7_12) {
                              newFeeData[groupIndex].transactions.credit.parcela7_12.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela7_12?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.debit?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.debit) {
                              newFeeData[groupIndex].transactions.debit.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.prepaid?.noCardTransactionMdr || ''}
                          onChange={(e) => {
                            const newFeeData = [...feeData];
                            const groupIndex = newFeeData.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1 && newFeeData[groupIndex].transactions.prepaid) {
                              newFeeData[groupIndex].transactions.prepaid.noCardTransactionMdr = parseFloat(e.target.value);
                              setFeeData(newFeeData);
                            }
                          }}
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.noCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Taxa Pix</h2>
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">MDR</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].nonCardPixMdr}
                  onChange={(e) => handlePixFeeChange('mdr', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  {merchantprice[0].nonCardPixMdr}%
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].nonCardPixMinimumCostFee}
                  onChange={(e) => handlePixFeeChange('custoMinimo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].nonCardPixMinimumCostFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
              {isEditing ? (
                <Input
                  value={merchantprice[0].nonCardPixCeilingFee}
                  onChange={(e) => handlePixFeeChange('custoMaximo', e.target.value)}
                  className="w-24 h-8 text-sm border rounded px-2"
                />
              ) : (
                <div className="px-3 py-1 text-sm w-24">
                  R$ {merchantprice[0].nonCardPixCeilingFee}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">Antecipação</p>
      {isEditing ? (
        <Input
          value={merchantprice[0].eventualAnticipationFee}
          onChange={(e) => handlePixFeeChange('antecipacao', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
          {merchantprice[0].eventualAnticipationFee}% ao mês
        </div>
      )}
    </div>
            
         
          </div>
        </div>
          </div>
        </TabsContent>
      
       
      </Tabs>
      
    </div>
  )
}


"use client";

import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnticipationListComponent from "@/features/anticipations/_components/anticipation-list";
import { AnticipationsListFilter } from "@/features/anticipations/_components/anticipations-filter";
import EventualAnticipationListComponent from "@/features/anticipations/_components/eventual-anticipation-list";
import { EventualAnticipationsListFilter } from "@/features/anticipations/_components/eventual-anticipations-filter";
import type {
  AnticipationList,
  EventualAnticipationList,
  MerchantDD,
} from "@/features/anticipations/server/anticipation";
import { useState } from "react";

export interface AnticipationTabsProps {
  anticipations: AnticipationList;
  eventualAnticipations: EventualAnticipationList;
  merchantDD: MerchantDD[];
  search: string;
  page: string;
  pageSize: string;
  merchantSlug: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedSettlementStartDate: string;
  expectedSettlementEndDate: string;
}

export function AnticipationTabs({
  anticipations,
  eventualAnticipations,
  merchantDD,
  page,
  pageSize,
  merchantSlug,
  type,
  status,
  startDate,
  endDate,
  expectedSettlementStartDate,
  expectedSettlementEndDate,
}: AnticipationTabsProps) {
  const [activeTab, setActiveTab] = useState("compulsory");

  return (
    <Tabs value={activeTab} className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-start gap-4 w-full">
            {activeTab === "compulsory" ? (
              <AnticipationsListFilter
                merchantDD={merchantDD}
                dateFromIn={startDate ? new Date(startDate) : undefined}
                dateToIn={endDate ? new Date(endDate) : undefined}
                merchantSlugIn={merchantSlug}
                typeIn={type}
                statusIn={status}
              />
            ) : (
              <EventualAnticipationsListFilter
                merchantDD={merchantDD}
                dateFromIn={startDate ? new Date(startDate) : undefined}
                dateToIn={endDate ? new Date(endDate) : undefined}
                expectedSettlementDateFromIn={
                  expectedSettlementStartDate
                    ? new Date(expectedSettlementStartDate)
                    : undefined
                }
                expectedSettlementDateToIn={
                  expectedSettlementEndDate
                    ? new Date(expectedSettlementEndDate)
                    : undefined
                }
                merchantSlugIn={merchantSlug}
                typeIn={type}
                statusIn={status}
              />
            )}
          
          <TabsList className="flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger
              value="compulsory"
              onClick={() => setActiveTab("compulsory")}
              className={
                activeTab === "compulsory"
                  ? "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  : ""
              }
            >
              COMPULSÓRIA
            </TabsTrigger>
            <TabsTrigger
              value="eventual"
              onClick={() => setActiveTab("eventual")}
              className={
                activeTab === "eventual"
                  ? "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  : ""
              }
            >
              EVENTUAL
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="compulsory"
          className={activeTab === "compulsory" ? "mt-6 block" : "hidden"}
        >
          <div className="w-full overflow-x-auto mb-4">
            <AnticipationListComponent anticipations={anticipations} />
            {anticipations.totalCount > 0 && (
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                  currentPageSize={Number(pageSize)}
                  pageName="portal/anticipations"
                />
                <PaginationRecords
                  totalRecords={anticipations.totalCount}
                  currentPage={Number(page)}
                  pageSize={Number(pageSize)}
                  pageName="portal/anticipations"
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent
          value="eventual"
          className={activeTab === "eventual" ? "mt-6 block" : "hidden"}
        >
          <div className="mb-4"></div>
          <div className="w-full overflow-x-auto">
            <EventualAnticipationListComponent
              anticipations={eventualAnticipations}
            />
            {eventualAnticipations.totalCount > 0 && (
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                  currentPageSize={Number(pageSize)}
                  pageName="portal/anticipations"
                />
                <PaginationRecords
                  totalRecords={eventualAnticipations.totalCount}
                  currentPage={Number(page)}
                  pageSize={Number(pageSize)}
                  pageName="portal/anticipations"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default AnticipationTabs;

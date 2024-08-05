"use client"

import React, { useMemo } from 'react'
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { type } from 'os';
import { TransactionType } from '@/lib/type';
import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface Props {
  userSettings: UserSettings
  from: Date
  to: Date
}
function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["stats", "overview", "categories", from, to],
    queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
  });
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)

  }, [userSettings.currency])
  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching} >
        <CategoriesCard
          formatter={formatter}
          type="revenue"
          data={statsQuery.data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching} >
        <CategoriesCard
          formatter={formatter}
          type="depense"
          data={statsQuery.data || []} />
      </SkeletonWrapper>
    </div>
  )
}

export default CategoriesStats;

function CategoriesCard({ formatter, type, data }: {
  type: TransactionType,
  formatter: Intl.NumberFormat,
  data: GetCategoriesStatsResponseType
}) {
  const filteredData = data.filter((el) => el.type === type)
  const total = filteredData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0);

  return (
    <Card className=' h-80 w-full '>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {type === "revenue" ? "Revenues" : "Depenses"} de la categorie
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2 	">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            Aucune donnée selectonnee
            <p className="text-sm text-muted-foreground">
              Essayez de sélectionner une période différente ou essayez d'ajouter nouvelle {""}
              {type === "revenue" ? "revenues" : "depenses"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between ">
                    <span className="flex items-center text-gray-400">
                      {item.categoryIcon} {item.category}

                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({percentage.toFixed(0)}%)
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatter.format(amount)}
                    </span>
                  </div>
                    <Progress
                    value={percentage}
                    indicator={
                      type==="revenue" ? "bg-emerald-500" : "bg-red-500"
                    }/>

                  </div>
                  

                )
              })}
            </div>
          </ScrollArea>

        )}
      </div>
    </Card>
  )
}
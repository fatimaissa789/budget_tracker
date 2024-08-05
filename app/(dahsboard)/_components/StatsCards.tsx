"use client"

import React, { ReactNode, useCallback, useMemo } from 'react'
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { Skeleton } from '@/components/ui/skeleton';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Title } from '@radix-ui/react-alert-dialog';
import { Card } from '@/components/ui/card';
import CountUp from "react-countup"


interface Props {
    from: Date;
    to: Date;
    userSettings: UserSettings
}

function StatsCards({ from, to, userSettings }: Props) {
    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["stats", "overview", from, to],
        queryFn: () =>
            fetch(
                `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
            ).then((res) => res.json()),
    })
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency)
    }, [userSettings.currency]);

    const revenue = statsQuery.data?.revenue || 0;
    const depense = statsQuery.data?.depense || 0;

    const balance = revenue - depense;
    return (
        <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
            <SkeletonWrapper isLoading={statsQuery.isFetching} >
                <StatCard
                    formatter={formatter}
                    value={revenue}
                    title="Revenue"
                    icon={

                        <TrendingUp className='h-12 w-12 items-center rounded-lg p-2
                        text-emerald-500 bg-emerald-400/10'/>

                    }
                />



            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching} >
                <StatCard
                    formatter={formatter}
                    value={depense}
                    title="Depense"
                    icon={

                        <TrendingDown className='h-12 w-12 items-center rounded-lg p-2
                        text-red-500 bg-red-400/10'/>

                    }
                />



            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching} >
                <StatCard
                    formatter={formatter}
                    value={balance}
                    title="Solde"
                    icon={

                        <Wallet className='h-12 w-12 items-center rounded-lg p-2
                        text-violet-500 bg-violet-400/10'/>

                    }
                />



            </SkeletonWrapper>
        </div>
    )
}

export default StatsCards

function StatCard({ title, value, icon, formatter }: {
    title: String;
    icon: ReactNode;
    value: number ;
    formatter: Intl.NumberFormat;
}) {
    const formatFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter])

    return (
        <Card className='flex h-24 w-full items-center gap-2 p-4'>
            {icon}
            <div className="flex flex-col items-start gap-0">
                <p className="text-muted-foreground">{title}</p>
                <CountUp 
                preserveValue
                redraw={false}
                className="text-3xl font-bold" 
                start={value}
                end={value}
                decimal='2'
                formattingFn={formatFn}
                />
            </div>
        </Card>
    )

}
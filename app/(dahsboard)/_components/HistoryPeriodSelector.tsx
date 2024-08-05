"use client"

import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, Timeframe } from '@/lib/type';

import { useQuery } from '@tanstack/react-query';
import { Table } from 'lucide-react';
import React from 'react'

interface Props {
    period:Period;
    setPeriod: (period:Period) => void;
    timeFrame:Timeframe;
    setTimeframe: (timeFrame:Timeframe) => void;
}
function HistoryPeriodSelector({
    period,setPeriod,timeFrame,setTimeframe}:Props) {
        const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
            queryKey:["overview","history","periods"],
            queryFn:() =>fetch(`/api/history-periods`).then((res) => res.json ()),
        })
  return (
    <div className='flex flex-wrap items-center gap-4'>
        <SkeletonWrapper isLoading={historyPeriods.isFetching} fullwidth={false} >
            <Tabs value={timeFrame}
            onValueChange={(value) =>setTimeframe(value as Timeframe)}>
                <TabsList>
                    <TabsTrigger value='year'>Annee</TabsTrigger>
                    <TabsTrigger value='month'>Mois</TabsTrigger>
                </TabsList>
            </Tabs>
            </SkeletonWrapper>
            <div className="flex flex-wrap items-center gap-2">
                  <SkeletonWrapper isLoading={historyPeriods.isFetching} fullwidth={false}>
                  <YearSelector 
                  period={period} 
                  setPeriod={setPeriod} 
                  years={historyPeriods.data || []} />
                  </SkeletonWrapper>

                  {
                    timeFrame === "month" && (
                        <SkeletonWrapper isLoading={historyPeriods.isFetching}
                        fullwidth={false}>
                          <MonthSelector period={period} setPeriod={setPeriod}/>

                        </SkeletonWrapper>
                    )
                  }
            </div>
    </div>
  )
}

export default HistoryPeriodSelector

function YearSelector ({period,setPeriod, years}:{
    period:Period,
    setPeriod:(period:Period) =>void;
    years: GetHistoryPeriodsResponseType
}) {
    return(
        <Select value={period.year.toString()}
        onValueChange={value => {
            setPeriod({
                month: period.month,
                year: parseInt(value)
            })
        }}>
            <SelectTrigger className='w-[180px]'>
                <SelectValue/>
           </SelectTrigger>
           <SelectContent>
            {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                    {year}

                </SelectItem>
            ))}

           </SelectContent>
        </Select>
        
           
    )
}
function MonthSelector ({period,setPeriod}:{
    period:Period,
    setPeriod:(period:Period) =>void;
  
}) {
    return(
        <Select value={period.month.toString()}
        onValueChange={value => {
            setPeriod({
                year: period.year,
                month: parseInt(value)
            })
        }}>
            <SelectTrigger className='w-[180px]'>
                <SelectValue/>
           </SelectTrigger>
           <SelectContent>
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((month) => 
           { 
            const monthStr = new Date(period.year, month,1).toLocaleString('default', { month: 'long' });
            
            return(
                <SelectItem key={month} value={month.toString()}>
                    {monthStr}

                </SelectItem>
            )})}

           </SelectContent>
        </Select>
        
           
    )
}
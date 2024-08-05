"use client";

import React from 'react';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import { cn } from '../../../lib/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';

function Overviews({ UserSettings }: { UserSettings: UserSettings }) {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Aperçu</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (from && to) {
                if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                  toast.error(`La plage de date ne doit pas dépasser ${MAX_DATE_RANGE_DAYS} jours`);
                  return;
                }
                setDateRange({ from, to });
              } else {
                toast.error('Veuillez sélectionner une plage de dates valide.');
              }
            }}
          />
        </div>
      </div>
      <div className='container flex w-ful flex-col gap-2'>
      <StatsCards
        userSettings={UserSettings}
        from={dateRange.from}
        to={dateRange.to}	
        />
        <CategoriesStats
         userSettings={UserSettings}
         from={dateRange.from}
         to={dateRange.to}	/>

      </div>
    
    </>
  );
}

export default Overviews;

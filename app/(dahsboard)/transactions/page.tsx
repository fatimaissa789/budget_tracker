"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";

function TransactionPage() {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="border-b bd-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text3xl font-bold">Historique Transaction</p>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (from && to) {
                if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                  toast.error(
                    `La plage de date ne doit pas dépasser ${MAX_DATE_RANGE_DAYS} jours`
                  );
                  return;
                }
                setDateRange({ from, to });
              } else {
                toast.error("Veuillez sélectionner une plage de dates valide.");
              }
            }}
          />{" "}
        </div>
      </div>
      <div className="container">
        <TransactionTable from={dateRange.from} to={dateRange.to}/>
      </div>
    </>
  );
}

export default TransactionPage;

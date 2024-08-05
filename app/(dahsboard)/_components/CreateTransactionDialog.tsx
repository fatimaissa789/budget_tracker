"use client"

import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import React, { ReactNode, useCallback, useState } from 'react'


interface Props {
    trigger:ReactNode;
    type:TransactionType;

    
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField,FormItem,FormLabel,FormControl,FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

export default function CreateTransactionDialog({trigger,type}: Props) {
    const form =useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues:{
            type,
            date: new Date(),
        }
    });
    const handleCategoryChange = useCallback(
      (value:string) =>{
        form.setValue("category",value);
      },
      [form]
    );
    const[open, setOpen] = useState(false);
    const QueryClient = useQueryClient()

    const {mutate , isPending} = useMutation({
        mutationFn:CreateTransaction,
        onSuccess: ()=>{
            toast.success("Transaction creée avec succes  🥳",
                {
                    id:"create-transaction",
                }
            );
            form.reset({
                type,
                description:"",
                amount:0,
                date: new Date(),
                category:"undefined",
            })


            ///
            QueryClient.invalidateQueries({
                queryKey:["overview"]
            });

             setOpen((prev) => !prev);

        },

    });
    const onSubmit  = useCallback((
        values:CreateTransactionSchemaType
    ) =>{
        toast.loading("Transaction creee ...", {id:"create-transaction"});
    mutate ({
        ...values,
        date: DateToUTCDate(values.date),
    })
    },
        [mutate])
  return( 
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>
                Créer un nouveau <span className={cn(
                    "m-1",
                    type === "revenue" ? "text-emerald-500" : "text-rose-500"
                )}>
                    {type}
                    
                </span>
                transaction
            </DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                control={form.control}
                name="description"
                render={({field}) =>(
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input defaultValue={""} {...field} />
                        </FormControl>
                        <FormDescription>
                            Description de la transaction (facultatif)
                        </FormDescription>
                    </FormItem>
                )
                } />


<FormField 
                control={form.control}
                name="amount"
                render={({field}) =>(
                    <FormItem className="flex flex-col">
                        <FormLabel>Montant</FormLabel>
                        <FormControl>
                            <Input defaultValue={0} type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            Description du montant (obligatoire)
                        </FormDescription>
                    </FormItem>
                )
                } />

                {/* Transactions: {form.watch("category")} */}
              <div className="flex items-center justify-between  gap-2">
              <FormField 
                control={form.control}
                name="category"
                render={({field}) =>(
                    <FormItem className="flex flex-col">
                        <FormLabel>Categorie</FormLabel>
                        <FormControl>
                           <CategoryPicker type={type} {...field}/>
                        </FormControl>
                        <FormDescription>
                           Selectionne la categorie de la transaction
                        </FormDescription>
                    </FormItem>
                )
                } />
                <FormField 
                control={form.control}
                name="date"
                render={({field}) =>(
                    <FormItem className="flex flex-col">
                        <FormLabel>Date transaction</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={
                                        cn("w-[200px] pl-3 text-left font-normal ",
                                            !field.value && "text-muted-foreground"
                                         )
                                    }>
                                        {field.value ? (
                                            format(field.value,"dd/MM/yyyy")
                                        ):(
                                            <span>Selectionne une date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"></CalendarIcon>
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-slate-100 rounded p-5">
                                <Calendar mode="single" 
                                selected={field.value} 
                                onSelect={(value) => {
                                    if (!value) return;
                                    field.onChange(value);}}
                                initialFocus/>
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                           Selectionne la date de la transaction
                        </FormDescription>
                        <FormMessage/>

                       
                    </FormItem>
                )
                } />
              </div>
            </form>
        </Form>
        <DialogFooter>
        <DialogClose asChild>
          <Button type='button' variant={"secondary"}  onClick={() => {
            form.reset()
          }}>Annuler</Button>
        </DialogClose>
        <Button  onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
      {!isPending && "Creer"}
      {isPending && <Loader2 className='animate-spin ' />}
        </Button>
    </DialogFooter>
    </DialogContent>

  </Dialog>)
}



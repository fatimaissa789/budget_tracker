"use server";
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

export async function DeleteTransaction(id : string) {
 const user = await  currentUser();
 if (!user) {
  redirect('/sign-in');
 }

 const transaction= await prisma.transaction.findUnique({
    where:{
        userId: user.id,
        id,
       
    },
 });
 if (!transaction) {
    throw new Error('Transaction not found');
 }
 await prisma.$transaction([
    //supprimer transaction depuis db
    prisma.transaction.delete({
        where:{
           
            id,
            userId: user.id,
          
        }
    }),

    //modifier historique du mois
    prisma.monthHistory.update({
        where:{
            day_month_year_userId:{
                userId: user.id,
                day: transaction.date.getDate(),
                month: transaction.date.getMonth() ,
                year: transaction.date.getFullYear(),
            }
        },
        data:{
           ...(
            transaction.type === "depense" && 
            {
                expense: {
                    decrement: transaction.amount,
                }
            }
           ),
           ...(
            transaction.type === "revenue" && 
            {
                income: {
                    decrement: transaction.amount,
                }
            }
           )
        }
    }),
    //modifier historique de l'anne
    prisma.yearHistory.update({
        where:{
            month_year_userId:{
                userId: user.id,
                month: transaction.date.getMonth() ,
                year: transaction.date.getFullYear(),
            }
        },
        data:{
           ...(
            transaction.type === "depense" && 
            {
                expense: {
                    decrement: transaction.amount,
                }
            }
           ),
           ...(
            transaction.type === "revenue" && 
            {
                income: {
                    decrement: transaction.amount,
                }
            }
           )
        }
    })
 ])
}

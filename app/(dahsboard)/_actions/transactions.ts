"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { create } from "domain";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType){
    const parsebody = CreateTransactionSchema.safeParse(form);

    if(!parsebody.success){
        throw new Error(parsebody.error.message);
    }
    const user = await currentUser();
    if(!user){
        redirect("/sign-in");   }
        const  {amount, category, date, description, type} = parsebody.data;
        const categoryRow =await prisma.category.findFirst({
            where:{
                userId:user.id,
                name:category,
            }

        });
        if (!categoryRow){
            throw  new Error("Catégorie introuvable");
        }

        await prisma.$transaction([
            //create user transaction
            prisma.transaction.create({
                data:{
                    userId:user.id,
                    amount,
                    date,
                    description:description || "",
                    type,
                    category:categoryRow.name,
                    categoryIcon:categoryRow.icon,
                },
            }),
            //update month agregate table
            prisma.monthHistory.upsert({
                where:{
                    day_month_year_userId:{
                        userId:user.id,
                        day:date.getDate(),
                        month:date.getUTCMonth(),
                        year:date.getUTCFullYear(),
                       
                    },
                  
                },
                create :{
                    userId:user.id,
                    day:date.getDate(),
                    month:date.getUTCMonth(),
                    year:date.getUTCFullYear(),
                    expense:type === "depense" ? amount : 0,
                    income:type === "revenue" ? amount : 0,

                },
                update:{
                    expense:{
                        increment:type === "depense" ? amount : 0,
                    },
                    income:{
                        increment:type === "revenue" ? amount : 0,
                    }

                }

            }),
            // update year agregate table
            prisma.yearHistory.upsert({
                where:{
                    month_year_userId:{
                        userId:user.id,
                      
                        month:date.getUTCMonth(),
                        year:date.getUTCFullYear(),
                       
                    },
                  
                },
                create :{
                    userId:user.id,
                   
                    month:date.getUTCMonth(),
                    year:date.getUTCFullYear(),
                    expense:type === "depense" ? amount : 0,
                    income:type === "revenue" ? amount : 0,

                },
                update:{
                    expense:{
                        increment:type === "depense" ? amount : 0,
                    },
                    income:{
                        increment:type === "revenue" ? amount : 0,
                    }

                }

            }),
        ]);
}
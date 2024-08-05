"use server"

import { UpdateUserCurrencySchema } from "@/schema/userSettings"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserSettings } from '@prisma/client';
import prisma from "@/lib/prisma";


export async function UpdateUserCurrency(currency: string){
    const parseBody = UpdateUserCurrencySchema.safeParse({
        currency,
    });
    
    if (!parseBody.success){
        throw parseBody.error;
    }
    const user =await currentUser();
    if(!user){
        redirect("/sign-in")
    }
    const UserSettings = await prisma.userSettings.update({
        where:{
            userId: user.id,
        },
        data:{
            currency,
        }

    });
    return UserSettings

}
"use server";
import prisma from '@/lib/prisma';
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType } from '@/schema/categories';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog';



export async function  CreateCategory(form: CreateCategorySchemaType){
    const parsebody = CreateCategorySchema.safeParse(form);

    if(!parsebody.success){
        throw new Error("bad request")
    };
    const user =await currentUser();
    if(!user){
        redirect("/sign-in")
    }
   const  {name, icon, type} = parsebody.data;
   return await prisma.category.create({
       data:{
        userId: user.id,
           name,
           icon,
           type,
         
       }
   })
}

export async function DeleteCategory(form: DeleteCategorySchemaType){
    const parsebody = DeleteCategorySchema.safeParse(form);

    if(!parsebody.success){
        throw new Error("bad request")
    };
    const user =await currentUser();
    if(!user){
        redirect("/sign-in")
    }
  return await prisma.category.delete({
        where :{
            name_userId_type:{
                userId:user.id,
                name:parsebody.data.name,
                type:parsebody.data.type
            }
        }
    })
}
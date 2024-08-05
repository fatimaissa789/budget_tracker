"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

function page() {
  return (
    <>
      {/* header */}
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text3xl font-bold">Gestion</p>
            <p className="text-muted-foreground">
              Gérer les paramètres et les catégories de votre compte
            </p>
          </div>
        </div>
      </div>
      {/* end header */}
      <div className="header flex-col flex gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Devise</CardTitle>
            <CardDescription>
              Définissez votre devise par défaut pour la transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategorieList type="revenue" />
        <CategorieList type="depense" />
      </div>
    </>
  );
}

export default page;

function CategorieList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  const dataAvailable  = categoriesQuery.data && categoriesQuery.data.length > 0;
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="items-center gap-2 flex justify-between">
            <div className="flex items-center gap-2">
              {type === "depense" ? (
                <TrendingDown
                  className="h-12 w-12
                    items-center rounded-lg bg-red-400/10 p-2 text-red-500"
                />
              ) : (
                <TrendingUp
                  className="h-12 w-12
                    items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500"
                />
              )}
              {""}
              <div>
            Categories pour      {type === "revenue" ? "Revenues" : "Depenses"}
                <div className="text-sm text-muted-foreground">
                  Triés par nom
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch}
              trigger={
                <Button className="gap-2 text-sm">
                    <PlusSquare className="h-4 w-4">
                        Creer Categorie
                    </PlusSquare>
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator/>
        {
          !dataAvailable &&(
            <div className="flex h-40 w-full  flex-col items-center justify-center">
              <p>
                Non {""}
              <span className={cn(
                "m-1",
                type=== "revenue" ? "text-emerald-500" : "text-red-500"
              )}>{type}</span>Categories disponible
              </p>
              <p className="text-sm text-muted-foreground">
                Creer des catégories pour commencer
              </p>
               
            </div>
          )
        }
        {
          dataAvailable &&(
            <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categoriesQuery.data.map((category:Category)=>(
                <CategoryCard category={category} key={category.name}/>
                
              ))}
            </div>
          )
        }
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard ({category}:{category:Category}) {
  return(
    <div className="flex border-seperate  flex-col  justify-between rounded-md  border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon} </span>
          <span>{category.name}</span>
          <DeleteCategoryDialog category={category} 
          trigger={
            <Button className="flex w-full  border-seperate items-center gap-2 rounded-t-none  text-muted-foreground hover:bg-red-500/20 "variant={"secondary"}>
          
          <TrashIcon className="h-4 w-4"/>
            Supprimer
          </Button>
          }/>

          
      </div>
    </div>
  )
}

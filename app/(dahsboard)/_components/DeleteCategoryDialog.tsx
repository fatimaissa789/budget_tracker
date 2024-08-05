"use client";

import { Category } from "@prisma/client";
import {
  useMutation,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { DeleteCategory } from "../_actions/categories";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader ,AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/type";

interface Props {
  trigger: React.ReactNode;
  category: Category;
}
function DeleteCategoryDialog({ category, trigger }: Props) {
  const categoryIdentifier = `${category.name}-${category.type}`;
  const QueryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Categorie supprimé avec succes  🥳", {
        id: categoryIdentifier,
      });
      await QueryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError:()=>{
        toast.error("Une erreur s'est produite", {
            id: categoryIdentifier,
        })
    }
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Etes-vous sur de vouloir supprimer cette categorie ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {" "}
            Cette action ne pourra pas etre annuler
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
                toast.loading("Suppression en cours...", {
                    id: categoryIdentifier,
                });
                deleteMutation.mutate({
                    name: category.name,
                    type: category.type as TransactionType
                })
            }
               
            }
          >
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategoryDialog;

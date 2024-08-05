"use client";

import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';
import { DeleteTransaction } from '../_actions/deleteTransaction';
import { error } from 'console';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
    transactionId: string
}
function DeleteTransactionDialog({open, setOpen, transactionId}: Props) {
    const QueryClient = useQueryClient();
    const deleteMutation = useMutation({
      mutationFn: DeleteTransaction,
      onSuccess: async () => {
        toast.success("Transaction supprimé avec succes  🥳", {
          id: transactionId,
        });
        await QueryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
      onError:()=>{
          toast.error(`Une erreur s'est produite`, {
              id: transactionId,
          })
      }
    });
    return (
      <AlertDialog open={open} onOpenChange={setOpen} >
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
              onClick={(event) => {
                  toast.loading("Suppression en cours...", {
                      id: transactionId,
                  });
                  deleteMutation.mutate(transactionId);
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

export default DeleteTransactionDialog




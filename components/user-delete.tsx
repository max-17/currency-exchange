"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/server/actions/user";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  id: string | number;
  name?: string;
};

export function UserDelete({ id, name }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const mutation = useMutation<string, Error, string>({
    mutationFn: (id) => deleteUser(String(id)),
    onMutate: async (delId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData<any[]>(["users"]);
      queryClient.setQueryData(["users"], (old: any[] | undefined) =>
        old ? old.filter((u) => String(u.id) !== String(delId)) : []
      );
      return { previous };
    },
    onError: (err, variables, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["users"], context.previous);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={(v) => setOpen(v)}>
      <AlertDialogCancel asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label={`Delete ${name ?? id}`}
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          {mutation.status === "pending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogCancel>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.status === "pending"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate(String(id))}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { getAllBranches } from "@/server/actions/branch";
import { LoaderCircle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createUser, updateUser } from "@/server/actions/user";

export const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER"]),
  branchIds: z.array(z.string()).optional(),
});

type formType = z.infer<typeof formSchema>;

export type FormValues = formType & { id?: string | number };

type CreatePayload = {
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER";
  branchIds?: string[];
};
type UpdatePayload = CreatePayload & { id: string };

export interface UserFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultValues?: FormValues;
  // optional callback executed after success
  onSuccess?: () => void;
}

export function UserForm({
  open,
  setOpen,
  defaultValues,
  onSuccess,
}: UserFormProps) {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      role: "MANAGER",
      branchIds: [],
    },
  });

  const queryClient = useQueryClient();

  // fetch branches via react-query
  const { data: branches = [], isLoading: branchesLoading } = useQuery<
    { id: string; name: string }[]
  >({
    queryKey: ["branches"],
    queryFn: getAllBranches,
  });

  // mutations: create and update with optimistic updates
  const createMutation = useMutation<void, unknown, CreatePayload>({
    mutationFn: (payload: CreatePayload) => createUser(payload),
    onMutate: async (newUser: CreatePayload) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData<any[]>(["users"]);
      // optimistic add with temporary id
      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        Branches: (newUser.branchIds || []).map((id: string) => ({
          id,
          name: branches.find((b) => b.id === id)?.name ?? id,
        })),
      };
      queryClient.setQueryData(["users"], (old: any[] | undefined) =>
        old ? [optimistic, ...old] : [optimistic]
      );
      return { previous };
    },
    onError: (err: unknown, variables: CreatePayload, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["users"], context.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation<void, unknown, UpdatePayload>({
    mutationFn: (payload: UpdatePayload) => updateUser(payload),
    onMutate: async (updated: UpdatePayload) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData<any[]>(["users"]);
      queryClient.setQueryData(["users"], (old: any[] | undefined) =>
        old
          ? old.map((u) =>
              String(u.id) === String(updated.id)
                ? {
                    ...u,
                    name: updated.name,
                    email: updated.email,
                    role: updated.role,
                    Branches: (updated.branchIds || []).map((id: string) => ({
                      id,
                      name: branches.find((b) => b.id === id)?.name ?? id,
                    })),
                  }
                : u
            )
          : []
      );
      return { previous };
    },
    onError: (err: unknown, variables: UpdatePayload, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["users"], context.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // reset when defaultValues change
  useEffect(() => {
    form.reset(
      defaultValues || {
        name: "",
        email: "",
        role: "MANAGER",
        branchIds: [],
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // use watch for reactive branchIds
  const watchedBranchIds = form.watch("branchIds") || [];

  // wrapper to reset after successful submit
  async function handleSubmit(values: formType) {
    // if defaultValues has an id we are editing
    try {
      if ((defaultValues as any)?.id) {
        await updateMutation.mutateAsync({
          id: String((defaultValues as any).id),
          ...values,
        });
      } else {
        await createMutation.mutateAsync(values as CreatePayload);
      }
      form.reset({ name: "", email: "", role: "MANAGER", branchIds: [] });
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      // errors handled by mutations (toasts may be added by caller)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues
              ? "Редактировать пользователя"
              : "Добавить пользователя"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input placeholder="Max James" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Select
                    defaultValue="MANAGER"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="MANAGER" value="MANAGER">
                        MANAGER
                      </SelectItem>
                      <SelectItem key="ADMIN" value="ADMIN">
                        ADMIN
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Филиалы</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {branchesLoading ? (
                  <div className="col-span-2 flex items-center">
                    <LoaderCircle className="mr-2 animate-spin" /> Loading
                    branches
                  </div>
                ) : (
                  branches.map((b: any) => (
                    <label key={b.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={watchedBranchIds.includes(b.id)}
                        onChange={(e) => {
                          const current = form.getValues("branchIds") || [];
                          if (e.target.checked) {
                            form.setValue("branchIds", [...current, b.id]);
                          } else {
                            form.setValue(
                              "branchIds",
                              current.filter((id) => id !== b.id)
                            );
                          }
                        }}
                      />
                      <span>{b.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                createMutation.status === "pending" ||
                updateMutation.status === "pending"
              }
            >
              {(form.formState.isSubmitting ||
                createMutation.status === "pending" ||
                updateMutation.status === "pending") && (
                <LoaderCircle className="mr-2 animate-spin" />
              )}
              {defaultValues ? "Сохранить" : "Создать"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

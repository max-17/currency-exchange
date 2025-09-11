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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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

export const formSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER"]),
});

type formType = z.infer<typeof formSchema>;

export interface UserFormProps {
  onSubmit: (data: formType) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultValues?: formType;
}

export function UserForm({
  onSubmit,
  open,
  setOpen,
  defaultValues,
}: UserFormProps) {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      role: "MANAGER",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить пользователя</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <Input placeholder="+998 12 345 6789" {...field} />
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
            <Button className="w-full" type="submit">
              {defaultValues ? "Сохранить" : "Создать"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

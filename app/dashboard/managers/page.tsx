"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import z from "zod";
import { createUser, deleteUser, getAllUsers } from "@/server/actions/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formSchema, UserForm } from "@/components/user-form";
import { EllipsisVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ManagersPage() {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (z.infer<typeof formSchema> & { id: string }) | undefined
  >(undefined);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await createUser(values);
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    setOpen(false);
    setSelectedUser(undefined);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <Button
          onClick={() => {
            setSelectedUser(undefined);
            setOpen(true);
          }}
        >
          Добавить пользователя
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Загрузка...
              </TableCell>
            </TableRow>
          )}
          {data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === "ADMIN" ? "Админ" : "Менеджер"}
              </TableCell>
              <TableCell className="w-5">
                <div className="ml-5">
                  <Popover
                  // open={popoverOpen} onOpenChange={setPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48">
                      <ul className="space-y-2">
                        <li>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedUser({ ...user, email: user.email! });
                              setOpen(true);
                            }}
                          >
                            Редактировать
                          </Button>
                        </li>
                        <li>
                          <Button
                            className="w-full"
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              await deleteUser(user.id);
                              await queryClient.invalidateQueries({
                                queryKey: ["users"],
                              });
                              setPopoverOpen(false);
                            }}
                          >
                            Удалить
                          </Button>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserForm
        open={open}
        setOpen={setOpen}
        defaultValues={selectedUser}
        onSubmit={onSubmit}
      />
    </div>
  );
}

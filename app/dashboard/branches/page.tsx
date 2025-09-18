"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllBranches,
  createBranch,
  deleteBranch,
  updateBranch,
} from "@/server/actions/branch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function BranchesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editBranch, setEditBranch] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  async function handleCreate() {
    await createBranch(name);
    setName("");
    setOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["branches"] });
  }

  async function handleDelete(id: string) {
    await deleteBranch(id);
    await queryClient.invalidateQueries({ queryKey: ["branches"] });
  }

  async function handleUpdate() {
    if (!editBranch) return;
    await updateBranch(editBranch.id, {
      name: editBranch.name,
      address: editBranch.address,
    });
    setEditBranch(null);
    await queryClient.invalidateQueries({ queryKey: ["branches"] });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Управление филиалами</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Добавить филиал</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить филиал</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название филиала"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Загрузка...
              </TableCell>
            </TableRow>
          )}
          {data?.map((b: any) => (
            <TableRow key={b.id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.address || "—"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditBranch(b)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDelete(b)}
                  >
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Edit dialog */}
      {editBranch && (
        <Dialog open={true} onOpenChange={() => setEditBranch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать филиал</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editBranch.name}
                onChange={(e) =>
                  setEditBranch({ ...editBranch, name: e.target.value })
                }
              />
              <Input
                value={editBranch.address || ""}
                onChange={(e) =>
                  setEditBranch({ ...editBranch, address: e.target.value })
                }
                placeholder="Адрес"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <Dialog open={true} onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтвердите удаление</DialogTitle>
            </DialogHeader>
            <p>Вы уверены, что хотите удалить филиал «{confirmDelete.name}»?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

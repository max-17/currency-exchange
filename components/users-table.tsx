"use client";

import React from "react";

type Props = { users?: { id: string | number; name: string }[] };

export function UsersTable({ users = [] }: Props) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium">Users</h3>
      <ul className="mt-2">
        {users.map((u) => (
          <li key={String(u.id)} className="py-1">
            {u.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
("use client");

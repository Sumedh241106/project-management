import { User } from "@/state/api";
import React from "react";

type Props = { user: User };

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center gap-3 rounded border p-4 shadow dark:bg-dark-secondary dark:text-white">
      <div className="h-10 w-10 rounded-full bg-gray-300" />
      <div>
        <h3 className="font-bold">{user.username}</h3>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
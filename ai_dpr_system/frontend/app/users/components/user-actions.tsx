"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, ShieldAlert, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "../page";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: 'Active' | 'Inactive') => void;
}

export function UserActions({ user, onEdit, onDelete, onUpdateStatus }: UserActionsProps) {
  const { toast } = useToast();

  const handleStatusChange = () => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    onUpdateStatus(user.id, newStatus);
    
    toast({
      title: "Status Updated",
      description: `User status set to ${newStatus}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleStatusChange}>
          {user.status === 'Active' ? (
            <>
              <ShieldAlert className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(user.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
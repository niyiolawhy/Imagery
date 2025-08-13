"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserX, Users } from "lucide-react";
import { useGetSharedUsers, useRemoveSharedUser } from "@/hooks/use-api";
import { SharedUser } from "@/types/album";
import { UnshareAlbumRequest } from "@/types/user";
import toast from "react-hot-toast";

interface RemoveShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  albumName: string;
}

export function RemoveShareDialog({
  open,
  onOpenChange,
  albumId,
  albumName,
}: RemoveShareDialogProps) {
  const { data: sharedUsersData, isLoading } = useGetSharedUsers(albumId);
  const removeSharedUserMutation = useRemoveSharedUser();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === sharedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sharedUsers.map(user => user.id));
    }
  };

  const handleRemoveUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const requestData: UnshareAlbumRequest = {
        albumId,
        userIdsToRemove: selectedUsers,
      };
      
      await removeSharedUserMutation.mutateAsync(requestData);
      
      toast.success(
        selectedUsers.length === 1
          ? "User removed from album successfully!"
          : `${selectedUsers.length} users removed from album successfully!`
      );
      
      setSelectedUsers([]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to remove users. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Shared Users</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const sharedUsers = sharedUsersData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Remove Shared Users
          </DialogTitle>
          <DialogDescription>
            Select users to remove from "{albumName}". They will no longer have access to this album.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sharedUsers.length > 0 && (
            <>
              <div className="text-sm text-gray-600 mb-2">
                {sharedUsers.length} user{sharedUsers.length !== 1 ? 's' : ''} shared with this album
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === sharedUsers.length && sharedUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 cursor-pointer">
                  Select All
                </label>
              </div>
            </>
          )}
          
          {sharedUsers.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No users are currently shared with this album.</p>
              <p className="text-sm text-gray-400 mt-1">Share the album first to see users here.</p>
            </div>
          ) : (
            sharedUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedUsers.includes(user.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleUserToggle(user.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.sharedAt && (
                      <Badge variant="secondary" className="text-xs">
                        Shared {formatDate(user.sharedAt)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveUsers}
            disabled={selectedUsers.length === 0 || removeSharedUserMutation.isPending}
          >
            {removeSharedUserMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <UserX className="w-4 h-4 mr-2" />
                {selectedUsers.length > 0 ? `Remove ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}` : "Remove Users"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client"

import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  useAlbumShare,
  useAlbumUnshare,
  useSearchUsers,
} from "@/hooks/use-api";
import { User } from "@/types/user";

// Code splitting: Separate components for better maintainability
const SearchInput = ({
  value,
  onChange,
  isSearching,
}: {
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
}) => (
  <Input
    placeholder="Search users by name or email"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={isSearching}
  />
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

const NoResultsMessage = () => (
  <div className="text-center py-4 text-muted-foreground">No users found</div>
);

const UserSearchResults = ({
  users,
  onSelectUser,
}: {
  users: User[];
  onSelectUser: (user: User) => void;
}) => (
  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
    {users.map((user) => (
      <div
        key={user.id}
        className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer"
        onClick={() => onSelectUser(user)}
      >
        <div className="flex items-center gap-2">
          <Avatar>
            <img
              src={user.avatarUrl || "/placeholder-user.jpg"}
              alt={user.name}
            />
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </div>
    ))}
  </ScrollArea>
);

const SelectedUsers = ({
  users,
  onRemoveUser,
}: {
  users: User[];
  onRemoveUser: (userId: string) => void;
}) => (
  <div className="space-y-4">
    <div className="text-sm font-medium">Selected Users</div>
    <div className="flex flex-wrap gap-2">
      {users.map((user) => (
        <Badge
          key={user.id}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {user.name}
          <button
            onClick={() => onRemoveUser(user.id)}
            className="ml-1 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  </div>
);

const useUserSearch = (searchQuery: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query by 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useSearchUsers(debouncedQuery);

  const users = useMemo(() => {
    if (!data) return [];
    // Handle the response structure: data.data.users
    return data.data?.users || data.users || [];
  }, [data]);

  return { users, isLoading, error };
};

// Custom hook for share/unshare logic
const useAlbumSharing = (albumId: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const albumShare = useAlbumShare();
  const albumUnshare = useAlbumUnshare();

  const shareAlbum = useCallback(
    async (userIds: string[]) => {
      try {
        await albumShare.mutateAsync({ albumId, userIds });
        toast({
          title: "Success",
          description: "Album shared successfully!",
        });
        onSuccess?.();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to share album. Please try again.",
        });
      }
    },
    [albumId, albumShare, toast, onSuccess]
  );

  const unshareUser = useCallback(
    async (userId: string) => {
      try {
        await albumUnshare.mutateAsync({ albumId, userIds: [userId] });
        toast({
          title: "Success",
          description: "User removed from album successfully!",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove user. Please try again.",
        });
      }
    },
    [albumId, albumUnshare, toast]
  );

  return { shareAlbum, unshareUser };
};

interface ShareDialogProps {
  albumId: string;
  albumName: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareDialog({
  albumId,
  albumName,
  children,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Use custom hooks for cleaner logic
  const { users: searchResults, isLoading: isSearching } =
    useUserSearch(searchQuery);
  const { shareAlbum, unshareUser } = useAlbumSharing(albumId, () => {
    setSelectedUsers([]);
    onOpenChange?.(false);
  });

  // Memoized handlers for better performance
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelectUser = useCallback(
    (user: User) => {
      if (!selectedUsers.find((u) => u.id === user.id)) {
        setSelectedUsers((prev) => [...prev, user]);
      }
      setSearchQuery("");
    },
    [selectedUsers]
  );

  const handleRemoveUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  const handleShareAlbum = useCallback(async () => {
    if (selectedUsers.length === 0) return;
    await shareAlbum(selectedUsers.map((user) => user.id));
  }, [selectedUsers, shareAlbum]);

  const handleUnshareUser = useCallback(
    async (userId: string) => {
      await unshareUser(userId);
    },
    [unshareUser]
  );

  // Memoized render conditions
  const showNoResults =
    !isSearching &&
    searchResults.length === 0 &&
    searchQuery.trim().length >= 2;
  const showSearchResults = !isSearching && searchResults.length > 0;
  const showSelectedUsers = selectedUsers.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Album: {albumName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            isSearching={isSearching}
          />

          {isSearching && <LoadingSpinner />}
          {showNoResults && <NoResultsMessage />}
          {showSearchResults && (
            <UserSearchResults
              users={searchResults}
              onSelectUser={handleSelectUser}
            />
          )}

          {showSelectedUsers && (
            <SelectedUsers
              users={selectedUsers}
              onRemoveUser={handleRemoveUser}
            />
          )}

          <Button
            onClick={handleShareAlbum}
            disabled={selectedUsers.length === 0}
            className="w-full"
          >
            Share Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
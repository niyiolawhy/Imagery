"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import { useUploadData } from "@/hooks/use-api";
import { useState } from "react";

interface CreateAlbumDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newAlbumName: string;
  onAlbumNameChange: (name: string) => void;
  onCreateAlbum: () => void;
}

export function CreateAlbumDialog({
  isOpen,
  onOpenChange,
  newAlbumName,
  onAlbumNameChange,
  onCreateAlbum, // will be unused
}: CreateAlbumDialogProps) {
  const [description, setDescription] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const { mutate, status } = useUploadData("/albums/album");

  const handleCreateAlbum = () => {
    if (!newAlbumName) {
      toast.error("Album name is required");
      return;
    }
    const formData = new FormData();
    formData.append("title", newAlbumName);
    if (description) formData.append("description", description);
    if (coverImageFile) formData.append("coverImage", coverImageFile);

    mutate(formData, {
      onSuccess: () => {
        toast.success("Album created successfully!");
        onOpenChange(false);
        onAlbumNameChange("");
        setDescription("");
        setCoverImageFile(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to create album");
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateAlbum();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="albumName">Album Name</Label>
            <Input
              id="albumName"
              placeholder="Enter album name"
              value={newAlbumName}
              onChange={(e) => onAlbumNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={status === "pending"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="albumDescription">Description</Label>
            <Input
              id="albumDescription"
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={status === "pending"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
              disabled={status === "pending"}
            />
          </div>
          <Button
            onClick={handleCreateAlbum}
            className="w-full"
            disabled={status === "pending"}
          >
            {status === "pending" ? "Creating..." : "Create Album"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
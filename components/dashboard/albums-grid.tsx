"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Pagination } from "@/components/ui/pagination";
import { Album } from "@/types/album";
import { useDeleteAlbum, useEditAlbum } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { Edit, MoreVertical, Trash2, ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CreateAlbumDialog } from "./create-album-dialog";

interface AlbumsGridProps {
  albums: Album[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AlbumsGrid({
  albums,
  currentPage,
  totalPages,
  onPageChange,
}: AlbumsGridProps) {
  const router = useRouter();
  const deleteAlbumMutation = useDeleteAlbum();
  const editAlbumMutation = useEditAlbum();

  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  const handleAlbumClick = (albumId: string) => {
    router.push(`/album/${albumId}`);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setEditForm({ title: album.title, description: album.description });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAlbum) return;

    try {
      await editAlbumMutation.mutateAsync({
        albumId: editingAlbum.id,
        data: {
          title: editForm.title,
          description: editForm.description,
          file: selectedFile || undefined,
        },
      });

      toast.success("Album updated successfully!");
      setIsEditDialogOpen(false);
      setEditingAlbum(null);
      setEditForm({ title: "", description: "" });
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to update album. Please try again.");
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    try {
      console.log("Attempting to delete album:", albumId);
      await deleteAlbumMutation.mutateAsync(albumId);
      console.log("Album deleted successfully");
      toast.success("Album deleted successfully!");
      setAlbumToDelete(null); // Close the confirmation
    } catch (error) {
      console.error("Failed to delete album:", error);
      toast.error("Failed to delete album. Please try again.");
    }
  };

  const confirmDelete = (album: Album) => {
    setAlbumToDelete(album);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No albums yet
        </h3>
        <p className="text-gray-500 mb-4">
          Create your first album to start organizing your photos
        </p>
        <CreateAlbumDialog />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Card
            key={album.id}
            className="group hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleAlbumClick(album.id)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={album.coverImage || "/placeholder.svg"}
                  alt={album.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAlbum(album);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(album);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <div className="w-full">
                <h3 className="font-semibold text-gray-900 truncate">
                  {album.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {album.description}
                </p>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                  <span>{album.photoCount || 0} photos</span>
                  <span>{new Date(album.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Album Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription>
              Update your album information and cover image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Album title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Album description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="coverImage">Cover Image (Optional)</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editAlbumMutation.isPending}
            >
              {editAlbumMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!albumToDelete}
        onOpenChange={(open) => !open && setAlbumToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Album</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{albumToDelete?.title}"? This
              action cannot be undone and will remove all photos in the album.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlbumToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                albumToDelete && handleDeleteAlbum(albumToDelete.id)
              }
              disabled={deleteAlbumMutation.isPending}
            >
              {deleteAlbumMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Album"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-8"
        />
      )}
    </div>
  );
}

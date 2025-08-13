"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Edit,
  MoreVertical,
  Trash2,
  ImageIcon,
  Loader2,
  Share2,
  UserX,
} from "lucide-react";
import { ShareDialog } from "@/components/album/share-dialog";
import { RemoveShareDialog } from "./remove-share-dialog";
import toast from "react-hot-toast";
import { CreateAlbumDialog } from "./create-album-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [shareAlbum, setShareAlbum] = useState<Album | null>(null);
  const [removeShareAlbum, setRemoveShareAlbum] = useState<Album | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAlbumClick = (albumId: string) =>
    router.push(`/album/${albumId}`);

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setEditForm({ title: album.title, description: album.description });
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
      setEditingAlbum(null);
      setEditForm({ title: "", description: "" });
      setSelectedFile(null);
    } catch {
      toast.error("Failed to update album. Please try again.");
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    try {
      await deleteAlbumMutation.mutateAsync(albumToDelete.id);
      toast.success("Album deleted successfully!");
      setAlbumToDelete(null);
    } catch {
      toast.error("Failed to delete album. Please try again.");
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
      {/* Album cards */}
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
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/placeholder.svg")
                  }
                />
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
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareAlbum(album);
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemoveShareAlbum(album);
                        }}
                      >
                        <UserX className="w-4 h-4 mr-2" /> Remove Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlbumToDelete(album);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
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

      {/* Edit dialog */}
      <Dialog
        open={!!editingAlbum}
        onOpenChange={(open) => !open && setEditingAlbum(null)}
      >
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
              />
            </div>
            <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAlbum(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editAlbumMutation.isPending}
            >
              {editAlbumMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      {shareAlbum && (
        <ShareDialog
          open={!!shareAlbum}
          onOpenChange={(open) => !open && setShareAlbum(null)}
          albumId={shareAlbum.id}
          albumName={shareAlbum.title}
        />
      )}

      {/* Remove Share dialog */}
      {removeShareAlbum && (
        <RemoveShareDialog
          open={!!removeShareAlbum}
          onOpenChange={(open) => !open && setRemoveShareAlbum(null)}
          albumId={removeShareAlbum.id}
          albumName={removeShareAlbum.title}
        />
      )}

      {/* Delete dialog */}
      <Dialog
        open={!!albumToDelete}
        onOpenChange={(open) => !open && setAlbumToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Album</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{albumToDelete?.title}"? This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlbumToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAlbum}
              disabled={deleteAlbumMutation.isPending}
            >
              {deleteAlbumMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
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

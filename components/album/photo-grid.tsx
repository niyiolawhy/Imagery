"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import {
  Download,
  MoreVertical,
  Trash2,
  Upload,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Photo } from "@/types/photo";

interface PhotoGridProps {
  photos: Photo[];
  searchTerm: string;
  onPhotoClick: (index: number) => void;
  onDownloadPhoto: (photo: Photo) => void;
  onDeletePhoto: (photoId: string) => void;
  onUpload: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function PhotoGrid({
  photos,
  searchTerm,
  onPhotoClick,
  onDownloadPhoto,
  onDeletePhoto,
  onUpload,
  currentPage,
  totalPages,
  onPageChange,
}: PhotoGridProps) {
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set());

  const filteredPhotos = photos.filter((photo) =>
    (photo.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePhoto = async (photoId: string) => {
    setDeletingPhotos((prev) => new Set(prev).add(photoId));
    try {
      await onDeletePhoto(photoId);
    } finally {
      setDeletingPhotos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(photoId);
        return newSet;
      });
    }
  };

  if (filteredPhotos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {searchTerm ? "No photos found" : "No photos yet"}
        </h3>
        <p className="text-gray-500 mb-4">
          {searchTerm
            ? "Try adjusting your search terms"
            : "This album is empty. Add your first photo to get started!"}
        </p>
        {!searchTerm && (
          <Button
            onClick={onUpload}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Photos
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPhotos.map((photo, index) => {
          const isDeleting = deletingPhotos.has(photo.id);

          return (
            <Card
              key={photo.id}
              className="group hover:shadow-lg transition-shadow overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={photo.imageUrl || "/placeholder.svg"}
                    alt={photo.description || `Photo ${photo.id}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onPhotoClick(index)}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />

                  {/* Delete loading overlay */}
                  {isDeleting && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                        disabled={isDeleting}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDownloadPhoto(photo)}
                        disabled={isDeleting}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-red-600"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages && totalPages > 1 && onPageChange && currentPage && (
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
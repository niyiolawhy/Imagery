"use client"

import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination";
import { Camera, Plus } from "lucide-react";
import { AlbumCard } from "./album-card";

interface Album {
  id: number;
  name: string;
  photoCount: number;
  coverImage: string;
}

interface AlbumsGridProps {
  albums: Album[];
  searchTerm: string;
  onDeleteAlbum: (albumId: number) => void;
  onCreateAlbum: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function AlbumsGrid({
  albums,
  searchTerm,
  onDeleteAlbum,
  onCreateAlbum,
  currentPage,
  totalPages,
  onPageChange,
}: AlbumsGridProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No albums found
        </h3>
        <p className="text-gray-500 mb-4">
          {searchTerm
            ? "Try adjusting your search terms"
            : "Create your first album to get started"}
        </p>
        {!searchTerm && (
          <Button
            onClick={onCreateAlbum}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} onDelete={onDeleteAlbum} />
        ))}
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
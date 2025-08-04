"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, MoreVertical, Trash2, Upload } from "lucide-react"

interface Photo {
  id: number
  src: string
  alt: string
  name: string
}

interface PhotoGridProps {
  photos: Photo[]
  searchTerm: string
  onPhotoClick: (index: number) => void
  onDownloadPhoto: (photo: Photo) => void
  onDeletePhoto: (photoId: number) => void
  onUpload: () => void
}

export function PhotoGrid({
  photos,
  searchTerm,
  onPhotoClick,
  onDownloadPhoto,
  onDeletePhoto,
  onUpload,
}: PhotoGridProps) {
  const filteredPhotos = photos.filter((photo) =>
    photo.alt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (filteredPhotos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No photos found
        </h3>
        <p className="text-gray-500 mb-4">
          {searchTerm
            ? "Try adjusting your search terms"
            : "Add your first photo to get started"}
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
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredPhotos.map((photo, index) => (
        <Card
          key={photo.id}
          className="group hover:shadow-lg transition-shadow overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onPhotoClick(index)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDownloadPhoto(photo)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeletePhoto(photo.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
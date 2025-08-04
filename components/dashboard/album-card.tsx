"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2 } from "lucide-react"

interface Album {
  id: number
  name: string
  photoCount: number
  coverImage: string
}

interface AlbumCardProps {
  album: Album
  onDelete: (albumId: number) => void
}

export function AlbumCard({ album, onDelete }: AlbumCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/album/${album.id}`}>
            <img
              src={album.coverImage || "/placeholder.svg"}
              alt={album.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </Link>
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
              <DropdownMenuItem onClick={() => onDelete(album.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-4">
          <Link href={`/album/${album.id}`}>
            <h3 className="font-semibold text-lg mb-1 hover:text-purple-600 transition-colors">
              {album.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">
            {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
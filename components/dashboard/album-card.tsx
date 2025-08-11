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
import Image from "next/image";

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

interface AlbumCardProps {
  album: Album;
  onDelete: (albumId: string) => void;
}

export function AlbumCard({ album, onDelete }: AlbumCardProps) {
  console.log("Cover image URL:", album.coverImage);

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/album/${album.id}`}>
            <Image
              src={album.coverImage || "/placeholder.svg"}
              alt={album.title}
              className="w-full h-48 object-cover rounded-t-lg"
              width={100}
              height={100}
              unoptimized
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
              <DropdownMenuItem
                onClick={() => onDelete(album.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-4">
          <Link href={`/album/${album.id}`}>
            <h3 className="font-semibold text-lg mb-1 hover:text-purple-600 transition-colors">
              {album.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">{album.description}</p>
        </div>
      </CardContent>
    </Card>
  );
} 
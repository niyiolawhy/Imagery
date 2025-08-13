"use client"

import { Button } from "@/components/ui/button"
import { Download, Upload, MoreVertical } from "lucide-react"
import { ShareDialog } from "./share-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AlbumHeaderProps {
  albumName: string;
  photoCount: number;
  albumDescription?: string;
  albumId: string;
  onDownloadAll: () => void;
  onUpload: () => void;
  isUploading: boolean;
}

export function AlbumHeader({
  albumName,
  photoCount,
  albumDescription,
  albumId,
  onDownloadAll,
  onUpload,
  isUploading,
}: AlbumHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{albumName}</h1>
            {albumDescription && (
              <p className="text-gray-600 mt-1">{albumDescription}</p>
            )}
            <p className="text-gray-600 mt-1">{photoCount} photos</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={onUpload}
              disabled={isUploading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Add Photos"}
            </Button>
            <Button variant="outline" size="sm" onClick={onDownloadAll}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ShareDialog albumId={albumId} albumName={albumName} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
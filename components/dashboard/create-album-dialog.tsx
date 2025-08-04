"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"

interface Album {
  id: number
  name: string
  photoCount: number
  coverImage: string
}

interface CreateAlbumDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newAlbumName: string
  onAlbumNameChange: (name: string) => void
  onCreateAlbum: () => void
}

export function CreateAlbumDialog({
  isOpen,
  onOpenChange,
  newAlbumName,
  onAlbumNameChange,
  onCreateAlbum,
}: CreateAlbumDialogProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onCreateAlbum()
    }
  }

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
            />
          </div>
          <Button onClick={onCreateAlbum} className="w-full">
            Create Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
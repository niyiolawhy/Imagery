"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Camera, Plus, Search, User, Settings, LogOut, MoreVertical, Trash2 } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import toast from "react-hot-toast"

export default function DashboardPage() {
  const [albums, setAlbums] = useState([
    { id: 1, name: "Summer Vacation 2024", photoCount: 24, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 2, name: "Family Portraits", photoCount: 12, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 3, name: "Nature Photography", photoCount: 36, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 4, name: "City Adventures", photoCount: 18, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 5, name: "Wedding Memories", photoCount: 45, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 6, name: "Pet Photos", photoCount: 8, coverImage: "/placeholder.svg?height=200&width=300" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [newAlbumName, setNewAlbumName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAlbums = albums.filter((album) => album.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      try {
        const newAlbum = {
          id: albums.length + 1,
          name: newAlbumName,
          photoCount: 0,
          coverImage: "/placeholder.svg?height=200&width=300",
        }
        setAlbums([...albums, newAlbum])
        setNewAlbumName("")
        setIsDialogOpen(false)
        toast.success("Album created successfully!")
      } catch (error) {
        toast.error("Failed to create album. Please try again.")
      }
    } else {
      toast.error("Please enter an album name.")
    }
  }

  const handleDeleteAlbum = (albumId: number) => {
    try {
      const albumName = albums.find((album) => album.id === albumId)?.name
      setAlbums(albums.filter((album) => album.id !== albumId))
      toast.success(`"${albumName}" album deleted successfully!`)
    } catch (error) {
      toast.error("Failed to delete album. Please try again.")
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Imagery
                </span>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search albums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("isAuthenticated")
                        localStorage.removeItem("userEmail")
                        localStorage.removeItem("userName")
                        toast.success("Logged out successfully!")
                        setTimeout(() => {
                          window.location.href = "/auth/login"
                        }, 1000)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Albums</h1>
              <p className="text-gray-600 mt-1">Organize and manage your photo collections</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleCreateAlbum()
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleCreateAlbum} className="w-full">
                    Create Album
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Albums Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <Card key={album.id} className="group hover:shadow-lg transition-shadow">
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
                        <DropdownMenuItem onClick={() => handleDeleteAlbum(album.id)} className="text-red-600">
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
            ))}
          </div>

          {filteredAlbums.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No albums found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Create your first album to get started"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Album
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

"use client"

import { useState } from "react"
import toast from "react-hot-toast"

interface Album {
  id: number
  name: string
  photoCount: number
  coverImage: string
}

export function useDashboard() {
  const [albums, setAlbums] = useState<Album[]>([
    { id: 1, name: "Summer Vacation 2024", photoCount: 24, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 2, name: "Family Portraits", photoCount: 12, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 3, name: "Nature Photography", photoCount: 36, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 4, name: "City Adventures", photoCount: 18, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 5, name: "Wedding Memories", photoCount: 45, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 6, name: "Pet Photos", photoCount: 8, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 7, name: "Food Photography", photoCount: 15, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 8, name: "Travel Diary", photoCount: 32, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 9, name: "Street Art", photoCount: 20, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 10, name: "Wildlife Safari", photoCount: 28, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 11, name: "Architecture Tour", photoCount: 16, coverImage: "/placeholder.svg?height=200&width=300" },
    { id: 12, name: "Beach Memories", photoCount: 22, coverImage: "/placeholder.svg?height=200&width=300" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [newAlbumName, setNewAlbumName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAlbums = filteredAlbums.slice(startIndex, endIndex)

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleAlbumNameChange = (name: string) => {
    setNewAlbumName(name)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    // State
    albums: paginatedAlbums,
    searchTerm,
    newAlbumName,
    isDialogOpen,
    currentPage,
    totalPages,
    
    // Actions
    handleCreateAlbum,
    handleDeleteAlbum,
    handleSearchChange,
    handleAlbumNameChange,
    handleDialogOpenChange,
    handlePageChange,
  }
} 
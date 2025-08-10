"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useFetchData } from "./use-api"

interface Album {
  id: string
  name: string
  photoCount: number
  coverImage: string
}

export function useDashboard() {
  const { data, isLoading, error } = useFetchData("/albums/album");
  const albums: Album[] = data?.data || [];

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

  const handleDeleteAlbum = (albumId: string) => {
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
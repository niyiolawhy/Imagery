"use client"

import { useState, useEffect } from "react"
import { useGetAlbums } from "./use-api"
import { Album } from "@/types/album"
import { useAuth } from "@/contexts/auth-context"

export function useDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const { checkAuthStatus } = useAuth()

  // Fetch albums from API
  const {
    data: albumsData,
    isLoading: isLoadingAlbums,
    error: albumsError,
    refetch: refetchAlbums
  } = useGetAlbums({
    search: searchTerm || undefined,
    page: currentPage.toString(),
    limit: itemsPerPage.toString()
  })

  // Handle auth errors
  useEffect(() => {
    if (albumsError) {
      const errorMessage = albumsError.message || 'Unknown error';
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('Token refresh failed')) {
        console.log('Auth error detected, checking auth status...');
        checkAuthStatus();
      }
    }
  }, [albumsError, checkAuthStatus]);

  // Filter albums based on search term
  const filteredAlbums = albumsData?.albums || []

  // Pagination
  const totalPages = albumsData?.totalPages || 1
  const totalAlbums = albumsData?.total || 0

  // Refetch albums when search term or page changes
  useEffect(() => {
    refetchAlbums()
  }, [searchTerm, currentPage, refetchAlbums])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  return {
    // State
    albums: filteredAlbums,
    searchTerm,
    currentPage,
    totalPages,
    totalAlbums,
    isLoadingAlbums,
    albumsError,
    
    // Actions
    setSearchTerm: handleSearchChange,
    setCurrentPage: handlePageChange,
    refetchAlbums,
  }
}
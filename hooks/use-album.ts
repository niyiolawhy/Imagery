"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import { useGetPhotos, useAddPhoto, useDeletePhoto, useGetAlbum } from "./use-api"
import { Photo as ApiPhoto, Photo } from "@/types/photo"

export function useAlbum() {
  const params = useParams()
  const { id } = params
  const albumId = id as string

  // API state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  // Fetch album data from API
  const {
    data: albumData,
    isLoading: isLoadingAlbum,
    error: albumError,
    refetch: refetchAlbum
  } = useGetAlbum(albumId)

  // Fetch photos from API
  const {
    data: photosData,
    isLoading: isLoadingPhotos,
    error: photosError,
    refetch: refetchPhotos
  } = useGetPhotos(albumId, {
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    search: searchTerm || undefined
  })

  // Photo mutations
  const addPhotoMutation = useAddPhoto()
  const deletePhotoMutation = useDeletePhoto()

  // Convert API photos to local Photo interface
  const photos: Photo[] = photosData?.photos?.map((apiPhoto: ApiPhoto) => ({
    id: apiPhoto.id,
    imageUrl: apiPhoto.imageUrl,
    description: apiPhoto.description || `Photo ${apiPhoto.id}`,
    albumId: apiPhoto.albumId,
    createdAt: apiPhoto.createdAt,
    updatedAt: apiPhoto.updatedAt,
  })) || []

  // Local state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isSlideShowOpen, setIsSlideShowOpen] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const albumName = albumData?.title || "Loading..." // Get album name from backend
  const albumDescription = albumData?.description || ""
  const albumCoverImage = albumData?.coverImage || ""
  const albumUrl = typeof window !== 'undefined' ? `${window.location.origin}/album/${id}` : ""

  const filteredPhotos = photos.filter((photo) =>
    (photo.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Use album photo count if available, otherwise use filtered photos length
  const photoCount = albumData?.photoCount || filteredPhotos.length

  // Pagination logic
  const totalPages = photosData?.totalPages || Math.ceil(filteredPhotos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex)

  const currentPhoto = filteredPhotos[currentPhotoIndex]

  // Refetch album and photos when albumId changes
  useEffect(() => {
    if (albumId) {
      refetchAlbum()
      refetchPhotos()
    }
  }, [albumId, refetchAlbum, refetchPhotos])

  // Refetch photos when search term or page changes
  useEffect(() => {
    if (albumId) {
      refetchPhotos()
    }
  }, [albumId, searchTerm, currentPage, refetchPhotos])

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && isSlideShowOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)
      }, 3000)
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlay, isSlideShowOpen, filteredPhotos.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isSlideShowOpen) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          goToPrevious()
          break
        case "ArrowRight":
          e.preventDefault()
          goToNext()
          break
        case "Escape":
          e.preventDefault()
          closeSlideShow()
          break
        case " ":
          e.preventDefault()
          toggleAutoPlay()
          break
        case "f":
        case "F":
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isSlideShowOpen, currentPhotoIndex, filteredPhotos.length, isFullscreen])

  // Fullscreen API handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const openSlideShow = (photoIndex: number) => {
    setCurrentPhotoIndex(photoIndex)
    setIsSlideShowOpen(true)
    setZoomLevel(1)
  }

  const closeSlideShow = () => {
    setIsSlideShowOpen(false)
    setIsAutoPlay(false)
    setZoomLevel(1)
    if (isFullscreen) {
      exitFullscreen()
    }
  }

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)
    setZoomLevel(1)
  }

  const goToPrevious = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    )
    setZoomLevel(1)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
    toast.success(isAutoPlay ? "Slideshow paused" : "Slideshow started")
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setZoomLevel(1)
  }

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      toast.error("Fullscreen not supported")
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (error) {
      // Ignore errors when exiting fullscreen
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const photoIndex = photos.findIndex((photo) => photo.id === photoId)

      // Call the delete API
      await deletePhotoMutation.mutateAsync({
        albumId,
        photoId: photoId
      })

      // Update local state for immediate UI feedback
      if (
        isSlideShowOpen &&
        photoIndex <= currentPhotoIndex &&
        currentPhotoIndex > 0
      ) {
        setCurrentPhotoIndex(currentPhotoIndex - 1)
      }

      toast.success("Photo deleted successfully!")
    } catch (error) {
      console.error('Delete photo error in use-album:', error);
      toast.error("Failed to delete photo. Please try again.")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("description", file.name.split(".")[0].replace(/[-_]/g, " "));

        return addPhotoMutation.mutateAsync({ albumId, formData });
      });

      await Promise.all(uploadPromises);

      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} uploaded successfully!`);
    } catch (error) {
      toast.error("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };




  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDownloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = photo.description || "photo.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("Photo downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download photo. Please try again.")
    }
  }

  const handleDownloadAll = async () => {
    try {
      toast.loading("Preparing download...", { id: "download-all" })

      for (let i = 0; i < Math.min(photos.length, 5); i++) {
        const photo = photos[i]
        const response = await fetch(photo.imageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${albumName}-${photo.description || `photo-${i + 1}`}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      toast.success("Album photos downloaded successfully!", {
        id: "download-all",
      })
    } catch (error) {
      toast.error("Failed to download album. Please try again.", {
        id: "download-all",
      })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(albumUrl)
      toast.success("Album link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link. Please try again.")
    }
  }

  const handleSocialShare = (platform: string) => {
    const text = `Check out my ${albumName} album${albumDescription ? `: ${albumDescription}` : ''} on Imagery!`
    const url = albumUrl

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          text
        )}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
      toast.success(`Shared on ${platform}!`)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    // State
    photos,
    searchTerm,
    currentPhotoIndex,
    isSlideShowOpen,
    isAutoPlay,
    showShareDialog,
    isUploading,
    zoomLevel,
    isFullscreen,
    fileInputRef,
    albumName,
    albumUrl,
    albumDescription,
    albumCoverImage,
    photoCount,
    albumData,
    filteredPhotos,
    paginatedPhotos,
    currentPhoto,
    currentPage,
    totalPages,
    isLoadingPhotos,
    photosError,
    isLoadingAlbum,
    albumError,
    
    // Actions
    setSearchTerm,
    setShowShareDialog,
    openSlideShow,
    closeSlideShow,
    goToNext,
    goToPrevious,
    toggleAutoPlay,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    toggleFullscreen,
    handleDeletePhoto,
    handleFileUpload,
    handleUploadClick,
    handleDownloadPhoto,
    handleDownloadAll,
    handleCopyLink,
    handleSocialShare,
    handlePageChange,
    refetchPhotos,
    refetchAlbum,
  }
} 
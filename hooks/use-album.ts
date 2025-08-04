"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"

interface Photo {
  id: number
  src: string
  alt: string
  name: string
}

export function useAlbum() {
  const params = useParams()
  const { id } = params

  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      src: "/placeholder.svg?height=800&width=1200&text=Beach+Sunset",
      alt: "Beach sunset",
      name: "beach-sunset.jpg",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=800&width=1200&text=Mountain+View",
      alt: "Mountain view",
      name: "mountain-view.jpg",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=800&width=1200&text=City+Lights",
      alt: "City lights",
      name: "city-lights.jpg",
    },
    {
      id: 4,
      src: "/placeholder.svg?height=800&width=1200&text=Forest+Path",
      alt: "Forest path",
      name: "forest-path.jpg",
    },
    {
      id: 5,
      src: "/placeholder.svg?height=800&width=1200&text=Ocean+Waves",
      alt: "Ocean waves",
      name: "ocean-waves.jpg",
    },
    {
      id: 6,
      src: "/placeholder.svg?height=800&width=1200&text=Desert+Landscape",
      alt: "Desert landscape",
      name: "desert-landscape.jpg",
    },
    {
      id: 7,
      src: "/placeholder.svg?height=800&width=1200&text=Lake+Reflection",
      alt: "Lake reflection",
      name: "lake-reflection.jpg",
    },
    {
      id: 8,
      src: "/placeholder.svg?height=800&width=1200&text=Snow+Peaks",
      alt: "Snow-capped peaks",
      name: "snow-peaks.jpg",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isSlideShowOpen, setIsSlideShowOpen] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const albumName = "Summer Vacation 2024"
  const albumUrl = typeof window !== 'undefined' ? `${window.location.origin}/album/${id}` : ""

  const filteredPhotos = photos.filter((photo) =>
    photo.alt.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const currentPhoto = filteredPhotos[currentPhotoIndex]

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

  const handleDeletePhoto = (photoId: number) => {
    try {
      const photoIndex = photos.findIndex((photo) => photo.id === photoId)
      setPhotos(photos.filter((photo) => photo.id !== photoId))

      if (
        isSlideShowOpen &&
        photoIndex <= currentPhotoIndex &&
        currentPhotoIndex > 0
      ) {
        setCurrentPhotoIndex(currentPhotoIndex - 1)
      }

      toast.success("Photo deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete photo. Please try again.")
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const newPhotos = Array.from(files).map((file, index) => {
        const url = URL.createObjectURL(file)
        return {
          id: photos.length + index + 1,
          src: url,
          alt: file.name.split(".")[0].replace(/[-_]/g, " "),
          name: file.name,
        }
      })

      setPhotos((prev) => [...prev, ...newPhotos])
      toast.success(
        `${files.length} photo${
          files.length > 1 ? "s" : ""
        } uploaded successfully!`
      )
    } catch (error) {
      toast.error("Failed to upload photos. Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDownloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = photo.name || "photo.jpg"
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
        const response = await fetch(photo.src)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${albumName}-${photo.name}` || `photo-${i + 1}.jpg`
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
    const text = `Check out my ${albumName} album on Imagery!`
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
    filteredPhotos,
    currentPhoto,
    
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
  }
} 
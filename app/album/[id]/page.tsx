"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Camera,
  ArrowLeft,
  Search,
  User,
  Settings,
  LogOut,
  MoreVertical,
  Trash2,
  Download,
  Share2,
  Upload,
  X,
  Copy,
  Facebook,
  Twitter,
  Mail,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import toast from "react-hot-toast"

export default function AlbumPage({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState([
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
  const albumUrl = `${window.location.origin}/album/${params.id}`

  const filteredPhotos = photos.filter((photo) => photo.alt.toLowerCase().includes(searchTerm.toLowerCase()))
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
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
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
    setCurrentPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
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

      if (isSlideShowOpen && photoIndex <= currentPhotoIndex && currentPhotoIndex > 0) {
        setCurrentPhotoIndex(currentPhotoIndex - 1)
      }

      toast.success("Photo deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete photo. Please try again.")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} uploaded successfully!`)
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

  const handleDownloadPhoto = async (photo: any) => {
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

      toast.success("Album photos downloaded successfully!", { id: "download-all" })
    } catch (error) {
      toast.error("Failed to download album. Please try again.", { id: "download-all" })
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
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
      toast.success(`Shared on ${platform}!`)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Albums
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Imagery
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search photos..."
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
                        window.location.href = "/auth/login"
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

        {/* Album Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{albumName}</h1>
                <p className="text-gray-600 mt-1">{photos.length} photos</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Add Photos"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPhotos.map((photo, index) => (
              <Card key={photo.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.alt}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openSlideShow(index)}
                    />
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
                        <DropdownMenuItem onClick={() => handleDownloadPhoto(photo)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePhoto(photo.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Add your first photo to get started"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleUploadClick}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              )}
            </div>
          )}
        </main>

        {/* Slideshow Modal */}
        {isSlideShowOpen && currentPhoto && (
          <Dialog open={isSlideShowOpen} onOpenChange={closeSlideShow}>
            <DialogContent className="max-w-5xl max-h-[85vh] p-0 bg-black border-0">
              <DialogHeader className="p-4 pb-0">
                <DialogTitle className="text-white text-center text-lg font-medium">{currentPhoto.alt}</DialogTitle>
              </DialogHeader>

              <div className="relative w-full h-[75vh] flex items-center justify-center">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-50 text-white hover:bg-white/20 h-8 w-8 rounded-full"
                  onClick={closeSlideShow}
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Photo Counter */}
                <div className="absolute top-2 left-2 z-50 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {filteredPhotos.length}
                </div>

                {/* Control Bar */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={toggleAutoPlay}
                  >
                    {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={resetZoom}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={() => handleDownloadPhoto(currentPhoto)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* Previous Button */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12 rounded-full"
                  onClick={goToPrevious}
                  disabled={filteredPhotos.length <= 1}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                {/* Next Button */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12 rounded-full"
                  onClick={goToNext}
                  disabled={filteredPhotos.length <= 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Main Image */}
                <div className="flex items-center justify-center w-full h-full p-6">
                  <img
                    src={currentPhoto.src || "/placeholder.svg"}
                    alt={currentPhoto.alt}
                    className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                    style={{ transform: `scale(${zoomLevel})` }}
                    draggable={false}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Album</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Input value={albumUrl} readOnly className="flex-1 bg-transparent border-none" />
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto bg-transparent"
                  onClick={() => handleSocialShare("facebook")}
                >
                  <Facebook className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs">Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto bg-transparent"
                  onClick={() => handleSocialShare("twitter")}
                >
                  <Twitter className="w-6 h-6 mb-2 text-blue-400" />
                  <span className="text-xs">Twitter</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto bg-transparent"
                  onClick={() => handleSocialShare("email")}
                >
                  <Mail className="w-6 h-6 mb-2 text-gray-600" />
                  <span className="text-xs">Email</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}

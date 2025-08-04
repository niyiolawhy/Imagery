"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

interface Photo {
  id: number
  src: string
  alt: string
  name: string
}

interface SlideshowModalProps {
  isOpen: boolean
  onClose: () => void
  currentPhoto: Photo | null
  currentPhotoIndex: number
  totalPhotos: number
  isAutoPlay: boolean
  zoomLevel: number
  isFullscreen: boolean
  onPrevious: () => void
  onNext: () => void
  onToggleAutoPlay: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onToggleFullscreen: () => void
  onDownloadPhoto: (photo: Photo) => void
}

export function SlideshowModal({
  isOpen,
  onClose,
  currentPhoto,
  currentPhotoIndex,
  totalPhotos,
  isAutoPlay,
  zoomLevel,
  isFullscreen,
  onPrevious,
  onNext,
  onToggleAutoPlay,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  onDownloadPhoto,
}: SlideshowModalProps) {
  if (!currentPhoto) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] p-0 bg-black border-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-white text-center text-lg font-medium">
            {currentPhoto.alt}
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[75vh] flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-50 text-white hover:bg-white/20 h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Photo Counter */}
          <div className="absolute top-2 left-2 z-50 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentPhotoIndex + 1} / {totalPhotos}
          </div>

          {/* Control Bar */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onToggleAutoPlay}
            >
              {isAutoPlay ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onZoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onResetZoom}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onZoomIn}
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={() => onDownloadPhoto(currentPhoto)}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="lg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12 rounded-full"
            onClick={onPrevious}
            disabled={totalPhotos <= 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="lg"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12 rounded-full"
            onClick={onNext}
            disabled={totalPhotos <= 1}
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
  )
} 
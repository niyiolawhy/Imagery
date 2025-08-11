"use client"

import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/album/app-header";
import { AlbumHeader } from "@/components/album/album-header";
import { PhotoGrid } from "@/components/album/photo-grid";
import { SlideshowModal } from "@/components/album/slideshow-modal";
import { ShareDialog } from "@/components/album/share-dialog";
import { useAlbum } from "@/hooks/use-album";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AlbumPage() {
  const {
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
  } = useAlbum();

  // Show loading state
  if (isLoadingAlbum || isLoadingPhotos) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-700">
              Loading album...
            </h2>
            <p className="text-gray-500">
              Please wait while we fetch your album and photos
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Show error state
  if (albumError || photosError) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {albumError
                  ? albumError.message?.includes("404")
                    ? "Album not found."
                    : "Failed to load album."
                  : "Failed to load album photos."}{" "}
                Please try refreshing the page or contact support if the problem
                persists.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Ensure album exists before rendering
  if (!albumData) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Album not found. Please check the URL or return to your
                dashboard.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <AppHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <AlbumHeader
          albumName={albumName}
          photoCount={photoCount}
          albumDescription={albumDescription}
          onShare={() => setShowShareDialog(true)}
          onDownloadAll={handleDownloadAll}
          onUpload={handleUploadClick}
          isUploading={isUploading}
        />
        <main className="container mx-auto px-4 py-8">
          {/* Show upload progress if uploading */}
          {isUploading && (
            <div className="mb-6">
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Uploading photos... Please wait while we process your files.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <PhotoGrid
            photos={paginatedPhotos}
            searchTerm={searchTerm}
            onPhotoClick={openSlideShow}
            onDownloadPhoto={handleDownloadPhoto}
            onDeletePhoto={handleDeletePhoto}
            onUpload={handleUploadClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
        
        <SlideshowModal
          isOpen={isSlideShowOpen}
          onClose={closeSlideShow}
          currentPhoto={currentPhoto}
          currentPhotoIndex={currentPhotoIndex}
          totalPhotos={filteredPhotos.length}
          isAutoPlay={isAutoPlay}
          zoomLevel={zoomLevel}
          isFullscreen={isFullscreen}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToggleAutoPlay={toggleAutoPlay}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={resetZoom}
          onToggleFullscreen={toggleFullscreen}
          onDownloadPhoto={handleDownloadPhoto}
        />
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          albumUrl={albumUrl}
          albumName={albumName}
          onCopyLink={handleCopyLink}
          onSocialShare={handleSocialShare}
        />
      </div>
    </AuthGuard>
  );
}

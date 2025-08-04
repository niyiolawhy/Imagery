"use client"

import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/album/app-header";
import { AlbumHeader } from "@/components/album/album-header";
import { PhotoGrid } from "@/components/album/photo-grid";
import { SlideshowModal } from "@/components/album/slideshow-modal";
import { ShareDialog } from "@/components/album/share-dialog";
import { useAlbum } from "@/hooks/use-album";

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
  } = useAlbum();

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
        <AppHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Album Header */}
        <AlbumHeader
          albumName={albumName}
          photoCount={photos.length}
          onShare={() => setShowShareDialog(true)}
          onDownloadAll={handleDownloadAll}
          onUpload={handleUploadClick}
          isUploading={isUploading}
        />

        {/* Photos Grid */}
        <main className="container mx-auto px-4 py-8">
          <PhotoGrid
            photos={photos}
            searchTerm={searchTerm}
            onPhotoClick={openSlideShow}
            onDownloadPhoto={handleDownloadPhoto}
            onDeletePhoto={handleDeletePhoto}
            onUpload={handleUploadClick}
          />
        </main>

        {/* Slideshow Modal */}
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

        {/* Share Dialog */}
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

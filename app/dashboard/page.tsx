"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CreateAlbumDialog } from "@/components/dashboard/create-album-dialog";
import { AlbumsGrid } from "@/components/dashboard/albums-grid";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const {
    albums,
    searchTerm,
    newAlbumName,
    isDialogOpen,
    currentPage,
    totalPages,
    handleCreateAlbum,
    handleDeleteAlbum,
    handleSearchChange,
    handleAlbumNameChange,
    handleDialogOpenChange,
    handlePageChange,
  } = useDashboard();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <DashboardHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Albums</h1>
              <p className="text-gray-600 mt-1">
                Organize and manage your photo collections
              </p>
            </div>

            <CreateAlbumDialog
              isOpen={isDialogOpen}
              onOpenChange={handleDialogOpenChange}
              newAlbumName={newAlbumName}
              onAlbumNameChange={handleAlbumNameChange}
              onCreateAlbum={handleCreateAlbum}
            />
          </div>

          {/* Albums Grid */}
          <AlbumsGrid
            albums={albums}
            searchTerm={searchTerm}
            onDeleteAlbum={handleDeleteAlbum}
            onCreateAlbum={() => handleDialogOpenChange(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </AuthGuard>
  );
}

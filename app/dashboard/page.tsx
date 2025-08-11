"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AlbumsGrid } from "@/components/dashboard/albums-grid";
import { CreateAlbumDialog } from "@/components/dashboard/create-album-dialog";
import { useDashboard } from "@/hooks/use-dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const {
    albums,
    searchTerm,
    currentPage,
    totalPages,
    totalAlbums,
    isLoadingAlbums,
    albumsError,
    setSearchTerm,
    setCurrentPage,
  } = useDashboard();

  // Show loading state
  if (isLoadingAlbums) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-700">
              Loading albums...
            </h2>
            <p className="text-gray-500">
              Please wait while we fetch your albums
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Show error state
  if (albumsError) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load albums. Please try refreshing the page or contact
                support if the problem persists.
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
        <DashboardHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalAlbums={totalAlbums}
        />
        <main className="container mx-auto px-4 py-8">
          <AlbumsGrid
            albums={albums}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
        <div className="!flex !justify-end !container !mx-auto !px-4  !py-10">
          <CreateAlbumDialog />
        </div>
      </div>
    </AuthGuard>
  );
}

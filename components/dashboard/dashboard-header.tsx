"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, LogOut, Camera, User, Bug } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CreateAlbumDialog } from "./create-album-dialog";
import { useProfile } from "@/hooks/use-profile";

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalAlbums: number;
}

export function DashboardHeader({
  searchTerm,
  onSearchChange,
  totalAlbums,
}: DashboardHeaderProps) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { profile } = useProfile();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Imagery
                </h1>
                <p className="text-sm text-gray-500">
                  {totalAlbums === 0
                    ? "Create your first album to get started"
                    : `${totalAlbums} album${totalAlbums === 1 ? "" : "s"}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search albums..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <CreateAlbumDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-gray-100"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        profile?.avatarUrl ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={profile?.avatarUrl || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {profile ? getUserInitials(profile.username) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{profile?.username}</p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <Link href="/profile" passHref legacyBehavior>
                  <DropdownMenuItem asChild>
                    <a>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
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
  );
} 
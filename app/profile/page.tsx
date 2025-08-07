"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfo } from "@/components/profile/profile-info";
import { useProfile } from "@/hooks/use-profile";

export default function ProfilePage() {
  const { profile, isLoading, error, needsProfile } = useProfile();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <ProfileHeader />

        {/* Profile Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-6">
            {/* Profile Info */}
            <ProfileInfo profile={profile} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

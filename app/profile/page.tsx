"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfo } from "@/components/profile/profile-info";
import { useProfile } from "@/hooks/use-profile";

export default function ProfilePage() {
  const { profile} = useProfile();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <ProfileHeader />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-6">
            <ProfileInfo profile={profile ?? null} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

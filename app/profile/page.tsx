"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ContactInfo } from "@/components/profile/contact-info";
import { PrivacySettings } from "@/components/profile/privacy-settings";
import { AccountActions } from "@/components/profile/account-actions";
import { useProfile } from "@/hooks/use-profile";

export default function ProfilePage() {
  const {
    profile,
    editedProfile,
    isEditing,
    handleSave,
    handleCancel,
    handleEdit,
    handleProfileChange,
  } = useProfile();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <ProfileHeader
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Profile Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-6">
            {/* Profile Info */}
            <ProfileInfo
              profile={profile}
              editedProfile={editedProfile}
              isEditing={isEditing}
              onProfileChange={handleProfileChange}
            />

            {/* Contact Information */}
            <ContactInfo
              profile={profile}
              editedProfile={editedProfile}
              isEditing={isEditing}
              onProfileChange={handleProfileChange}
            />

            {/* Privacy Settings */}
            <PrivacySettings />

            {/* Account Actions */}
            <AccountActions />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone } from "lucide-react"

interface Profile {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  bio: string
}

interface ContactInfoProps {
  profile: Profile | null;
  editedProfile: Profile | null;
  isEditing: boolean;
  onProfileChange: (profile: Profile) => void;
}

export function ContactInfo({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">
          No contact information found.
        </p>
        <p className="text-gray-400">
          Please enter your contact details to get started.
        </p>
      </div>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Manage your contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-600">{profile.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-gray-600">{profile.location}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
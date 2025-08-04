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
  profile: Profile
  editedProfile: Profile
  isEditing: boolean
  onProfileChange: (profile: Profile) => void
}

export function ContactInfo({ profile, editedProfile, isEditing, onProfileChange }: ContactInfoProps) {
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
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => onProfileChange({ ...editedProfile, email: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => onProfileChange({ ...editedProfile, phone: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{profile.phone}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) => onProfileChange({ ...editedProfile, location: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{profile.location}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
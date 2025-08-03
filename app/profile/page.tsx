"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Camera, ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    bio: "Photography enthusiast who loves capturing life's beautiful moments. Always exploring new places and perspectives through my lens.",
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    try {
      setProfile(editedProfile)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    toast.info("Changes cancelled")
  }

  const handleSwitchChange = (setting: string, checked: boolean) => {
    toast.success(`${setting} ${checked ? "enabled" : "disabled"}`)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Imagery
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback className="text-2xl">JD</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        onClick={() => toast.info("Photo upload feature coming soon!")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Input
                            id="bio"
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                        <p className="text-gray-600 mb-4">{profile.bio}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Joined {profile.joinDate}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {profile.location}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
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
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
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
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
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
                          onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
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

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-gray-600">Allow others to find and view your profile</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={(checked) => handleSwitchChange("Public Profile", checked)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Album Sharing</Label>
                    <p className="text-sm text-gray-600">Allow sharing of your albums with others</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={(checked) => handleSwitchChange("Album Sharing", checked)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications about album activity</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleSwitchChange("Email Notifications", checked)} />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => toast.info("Password change feature coming soon!")}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => toast.info("Data download feature coming soon!")}
                >
                  Download My Data
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => toast.error("Account deletion requires confirmation")}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

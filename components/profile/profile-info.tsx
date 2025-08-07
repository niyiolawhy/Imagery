"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin } from "lucide-react"

interface Profile {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  bio: string
}

interface ProfileInfoProps {
  profile: Profile | null;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">No profile found.</p>
        <p className="text-gray-400">
          Please enter your profile details to get started.
        </p>
      </div>
    );
  }
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt="Profile"
              />
              <AvatarFallback className="text-2xl">
                {(() => {
                  const name = (profile?.name || "").trim();
                  if (name) {
                    const names = name.split(" ");
                    const first = names[0]?.[0] || "";
                    const last =
                      names.length > 1 ? names[names.length - 1][0] : "";
                    return (first + last).toUpperCase() || "JD";
                  }
                  return "JD";
                })()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 text-center md:text-left">
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile?.name || ""}
              </h1>
              <p className="text-gray-600 mb-4">{profile?.bio || ""}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {profile?.joinDate || ""}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile?.location || ""}
                </div>
              </div>
            </>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
"use client"

import { useState } from "react"
import toast from "react-hot-toast"

interface Profile {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  bio: string
}

export function useProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    bio: "Photography enthusiast who loves capturing life's beautiful moments. Always exploring new places and perspectives through my lens.",
  })

  const [editedProfile, setEditedProfile] = useState<Profile>(profile)

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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleProfileChange = (newProfile: Profile) => {
    setEditedProfile(newProfile)
  }

  return {
    // State
    profile,
    editedProfile,
    isEditing,
    
    // Actions
    handleSave,
    handleCancel,
    handleEdit,
    handleProfileChange,
  }
} 
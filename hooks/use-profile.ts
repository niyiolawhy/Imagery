"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useFetchData } from "@/hooks/use-api"
import React from "react"

interface Profile {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  bio: string
}

export function useProfile() {
  const { data, isLoading, error } = useFetchData("/users/profile");

  const profile = data ?? null;

  return {
    profile,
    isLoading,
    error,
    needsProfile: !profile,
  };
} 
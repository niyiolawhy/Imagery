"use client"
import { Profile } from "@/components/profile/profile-info";
import { useFetchData } from "@/hooks/use-api"
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function useProfile() {
  const { data: apiData, isLoading, error } = useFetchData("/users/profile");

  const profile: Profile | null = apiData?.data
    ? {
      name: apiData.data.name || "",
      email: apiData.data.email || "",
      username: apiData.data.username || "",
      avatarUrl: apiData.data.avatarUrl || "",
      dob: formatDate(apiData.data.dob),
      joinDate: formatDate(apiData.data.createdAt),
      bio: apiData.data.bio || "",
    }
    : null;

  return {
    profile,
    isLoading,
    error,
    needsProfile: !profile,
  };
} 
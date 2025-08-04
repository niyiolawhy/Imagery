"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

interface PrivacySettingsProps {
  // Add props if needed for managing privacy settings state
}

export function PrivacySettings({}: PrivacySettingsProps) {
  const handleSwitchChange = (setting: string, checked: boolean) => {
    toast.success(`${setting} ${checked ? "enabled" : "disabled"}`)
  }

  return (
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
  )
} 
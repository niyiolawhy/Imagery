"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

interface AccountActionsProps {
  // Add props if needed for managing account actions
}

export function AccountActions({}: AccountActionsProps) {
  return (
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
  )
} 
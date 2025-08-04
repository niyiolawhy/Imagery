"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Mail, Twitter } from "lucide-react"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  albumUrl: string
  albumName: string
  onCopyLink: () => void
  onSocialShare: (platform: string) => void
}

export function ShareDialog({
  isOpen,
  onClose,
  albumUrl,
  albumName,
  onCopyLink,
  onSocialShare,
}: ShareDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Input
              value={albumUrl}
              readOnly
              className="flex-1 bg-transparent border-none"
            />
            <Button variant="outline" size="sm" onClick={onCopyLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto bg-transparent"
              onClick={() => onSocialShare("facebook")}
            >
              <Facebook className="w-6 h-6 mb-2 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto bg-transparent"
              onClick={() => onSocialShare("twitter")}
            >
              <Twitter className="w-6 h-6 mb-2 text-blue-400" />
              <span className="text-xs">Twitter</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto bg-transparent"
              onClick={() => onSocialShare("email")}
            >
              <Mail className="w-6 h-6 mb-2 text-gray-600" />
              <span className="text-xs">Email</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
import { AuthGuard } from "@/components/auth-guard"

export default function AlbumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Users, Shield, Smartphone } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Imagery
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Photos,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Beautifully Organized
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create stunning photo albums, organize your memories, and share them with the world. Imagery makes photo
              management simple and beautiful.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Creating Albums
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Albums</h3>
                <p className="text-gray-600">
                  Create and organize unlimited photo albums with intelligent sorting and tagging.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share your albums with friends and family with customizable privacy settings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Storage</h3>
                <p className="text-gray-600">
                  Your photos are safely stored with enterprise-grade security and privacy protection.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Responsive Design</h3>
            <p className="text-gray-600 mb-6">
              Access your albums anywhere, anytime. Imagery works perfectly on all devices.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Imagery</span>
          </div>
          <p className="text-gray-600 text-sm">© 2024 Imagery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

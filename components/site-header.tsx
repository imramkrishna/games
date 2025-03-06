import Link from "next/link"
import { GamepadIcon as GameController } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <GameController className="h-6 w-6" />
          <span className="font-bold">GameHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/games/flappy-bird" className="text-sm font-medium">
            Flappy Bird
          </Link>
          <Link href="/games/snake" className="text-sm font-medium">
            Snake
          </Link>
          <Link href="/games/tetris" className="text-sm font-medium">
            Tetris
          </Link>
        </nav>
        <div className="ml-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  )
}


import Link from "next/link"
import { GamepadIcon as GameController } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full py-6 border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <GameController className="w-5 h-5" />
          <span className="font-semibold">GameHub</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
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
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Ram Krishna Yadav. All rights reserved.</p>
      </div>
    </footer>
  )
}


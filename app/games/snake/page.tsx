import { SnakeGame } from "@/components/snake-game"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SnakePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Snake</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Control the snake, eat food, and grow as long as possible without hitting the walls or yourself.
            </p>
          </div>

          <div className="w-full max-w-md border rounded-lg overflow-hidden shadow-lg">
            <SnakeGame />
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold">How to Play</h2>
            <ul className="space-y-2 text-left max-w-md">
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">1</span>
                <span>
                  Use <strong>arrow keys</strong> to control the snake's direction
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">2</span>
                <span>Eat the red food to grow and earn points</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">3</span>
                <span>Avoid hitting the walls or your own tail</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">4</span>
                <span>On mobile, swipe in the direction you want to move</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Link href="/">
              <Button variant="outline">Back to Games</Button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}


import { FlappyBirdGame } from "@/components/flappy-bird-game"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FlappyBirdPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Flappy Bird</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Press spacebar or tap the screen to make the bird fly. Avoid the pipes!
            </p>
          </div>

          <div className="w-full max-w-3xl border rounded-lg overflow-hidden shadow-lg">
            <FlappyBirdGame />
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold">How to Play</h2>
            <ul className="space-y-2 text-left max-w-md">
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">1</span>
                <span>
                  Press <strong>spacebar</strong> (desktop) or <strong>tap the screen</strong> (mobile) to make the bird
                  fly
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">2</span>
                <span>Navigate through the gaps between pipes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">3</span>
                <span>Each pipe you pass gives you 1 point</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">4</span>
                <span>If you hit a pipe or the ground, the game is over</span>
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


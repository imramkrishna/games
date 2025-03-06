import Link from "next/link"
import { GameCard } from "@/components/game-card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Play Classic Games Online
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Enjoy your favorite classic games right in your browser. No downloads required.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  href="/games/flappy-bird"
                  className="inline-flex items-center justify-center h-10 px-8 text-sm font-medium transition-colors rounded-md shadow bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Play Now
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Games</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Check out our collection of classic arcade games.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                <GameCard
                  title="Flappy Bird"
                  description="Navigate through pipes and set a high score in this addictive classic."
                  image="/flappybird.avif?height=300&width=400"
                  href="/games/flappy-bird"
                  featured={true}
                />
                <GameCard
                  title="Snake"
                  description="Grow your snake by eating food while avoiding walls and your own tail."
                  image="/snakegame.avif?height=300&width=400"
                  href="/games/snake"
                  featured={true}
                />
                <GameCard
                  title="Tetris"
                  description="Arrange falling blocks to create complete lines in this timeless puzzle game."
                  image="/tetris.png?height=300&width=400"
                  href="/games/tetris"
                  featured={true}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}


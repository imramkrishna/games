import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface GameCardProps {
  title: string
  description: string
  image: string
  href: string
  featured?: boolean
}

export function GameCard({ title, description, image, href, featured = false }: GameCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={href}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Play Now
        </Link>
      </CardFooter>
    </Card>
  )
}


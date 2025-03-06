"use client"
import Link from "next/link"
import { GamepadIcon as GameController, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/games/flappy-bird", label: "Flappy Bird" },
    { href: "/games/snake", label: "Snake" },
    { href: "/games/tetris", label: "Tetris" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-16">
        <Link href="/" className="flex items-center space-x-2">
          <GameController className="w-6 h-6" />
          <span className="font-bold">GameHub</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden gap-6 ml-auto md:flex">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden ml-4 md:block">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MenuIcon className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button variant="outline" size="sm" className="mt-4">
                  Sign In
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}


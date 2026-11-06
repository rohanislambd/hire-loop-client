"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Image from "next/image"

const NAV_LINKS = [
  { name: "Browse Jobs", href: "/jobs" },
  { name: "Company", href: "/company" },
  { name: "Pricing", href: "/pricing" },
]


export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isSignInActive =
    pathname === "/sign-in" || pathname === "/login"

  return (
    <header className=" sticky top-0 z-50 w-full px-3 py-3 sm:px-6 lg:px-8">
      <nav
        aria-label="Main Navigation"
        className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#14151a]/95 px-4 py-2.5 sm:px-6 sm:py-3 shadow-xl shadow-black/30 backdrop-blur-md"
      >
        {/* Brand Logo */}
      <Link href="/">
        <Image 
         src='/logo.png'
         width={154}
         height={44}
         alt="logo"
        />
      </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {/* Main Links */}
          <ul className="flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors duration-200",
                      active
                        ? "font-semibold text-[#958eff] drop-shadow-[0_1px_4px_rgba(255,255,255,0.25)]"
                        : "font-medium text-neutral-400 hover:text-[#958eff]"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>

     
          <Separator
            orientation="vertical"
            className="w-px bg-neutral-700/70"
          />

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4 lg:gap-5">
            <Link
              href="/sign-in"
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                isSignInActive
                  ? "font-semibold text-[#7b75f8] underline underline-offset-4 decoration-[#7b75f8]"
                  : " text-white hover:text-[#958eff]"
              )}
            >
              Sign In
            </Link>

            <Button
              nativeButton={false}
              className="h-9 rounded-xl bg-[#5d63f6] px-4.5 text-sm font-medium text-white shadow-md shadow-[#5d63f6]/30 transition-all duration-200 hover:bg-[#4d53e8] hover:shadow-[#5d63f6]/40 active:scale-[0.98]"
              render={<Link href="/get-started" />}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Hamburger Trigger & Sheet Drawer */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            nativeButton={false}
            size="sm"
            className="h-8 rounded-lg bg-[#5d63f6] px-3 text-xs font-medium text-white shadow-sm hover:bg-[#4d53e8]"
            render={<Link href="/get-started" />}
          >
            Get Started
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  aria-label="Toggle navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 border-neutral-800 bg-[#14151a] p-6 text-white"
            >
            

              <div className="mt-8 flex flex-col gap-6">
                {/* Navigation Links */}
                <div className="flex flex-col gap-2">
                  
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => {
                      const active = isLinkActive(link.href)
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                              active
                                ? "bg-white/10 font-semibold text-white"
                                : "font-medium text-neutral-300 hover:bg-white/5 hover:text-[#958eff]"
                            )}
                          >
                            {link.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <Separator className="bg-neutral-800" />

                {/* Auth Actions */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-center rounded-lg border border-neutral-700/60 py-2 text-sm font-medium transition-colors",
                      isSignInActive
                        ? "border-[#7b75f8] text-white"
                        : "text-[#7b75f8] hover:bg-[#7b75f8]/10 hover:text-[#958eff]"
                    )}
                  >
                    Sign In
                  </Link>

                  <Button
                    nativeButton={false}
                    className="w-full rounded-xl bg-[#5d63f6] py-2.5 text-sm font-medium text-white shadow-md shadow-[#5d63f6]/30 hover:bg-[#4d53e8]"
                    render={
                      <Link
                        href="/get-started"
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    }
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from "@/app/dashboard/actions"
import type { Profile } from "@/lib/types"

export function DashboardHeader({ profile, email }: { profile: Profile | null; email: string }) {
  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() ||
    email[0]?.toUpperCase() ||
    "U"
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Sky Bank customer"

  async function handleSignOut() {
    "use server"
    await signOut()
    redirect("/auth/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/transactions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Transactions
            </Link>
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{fullName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>{fullName}</span>
              <span className="text-xs font-normal text-muted-foreground">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={handleSignOut}>
              <button type="submit" className="w-full">
                <DropdownMenuItem className="cursor-pointer">Sign out</DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

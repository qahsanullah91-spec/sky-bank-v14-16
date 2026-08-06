import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const FEATURES = [
  {
    title: "Instant transfers",
    description: "Move money to any Sky Bank account in seconds with a simple 10-digit account number.",
  },
  {
    title: "Real-time balances",
    description: "Every deposit and transfer updates your balance immediately, backed by an auditable ledger.",
  },
  {
    title: "Bank-grade security",
    description: "Row-level security and server-verified transactions keep your money and data protected.",
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect("/dashboard")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Open account</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Digital banking, done right
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Banking that moves at the speed of the sky.
            </h1>
            <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              Open checking and savings accounts, send instant transfers, and track every transaction — all in one
              secure place.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Get started free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">I have an account</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <Image
              src="/images/hero-app.png"
              alt="Sky Bank mobile app showing an account balance and recent transactions"
              width={512}
              height={512}
              className="h-auto w-full rounded-2xl"
              priority
            />
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-foreground">{feature.title}</h2>
                <p className="text-pretty leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
            <h2 className="text-balance text-3xl font-semibold tracking-tight">Ready to open your account?</h2>
            <p className="max-w-md text-pretty opacity-90">
              Join Sky Bank today. It takes less than a minute to get started.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/sign-up">Open your account</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sky Bank. For demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}

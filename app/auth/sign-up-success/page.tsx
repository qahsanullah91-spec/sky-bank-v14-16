import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            {"We've sent you a confirmation link. Confirm your email to activate your Sky Bank account, then sign in."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

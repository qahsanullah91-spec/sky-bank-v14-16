import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Authentication error</CardTitle>
          <CardDescription>
            {"We couldn't complete that request. The link may have expired or already been used."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

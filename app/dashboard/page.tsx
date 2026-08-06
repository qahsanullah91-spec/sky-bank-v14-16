import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AccountCard } from "@/components/account-card"
import { TransferForm } from "@/components/transfer-form"
import { TransactionList } from "@/components/transaction-list"
import { OpenAccountDialog } from "@/components/open-account-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import type { Account, Transaction } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: accountsData }, { data: transactionsData }] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at", { ascending: true }),
    supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(15),
  ])

  const accounts = (accountsData ?? []) as Account[]
  const transactions = (transactionsData ?? []) as Transaction[]
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm opacity-80">Total balance</p>
          <p className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">{formatCurrency(totalBalance)}</p>
          <p className="mt-1 text-sm opacity-80">
            Across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
          </p>
        </div>
        <OpenAccountDialog
          trigger={
            <Button variant="secondary" size="lg">
              Open new account
            </Button>
          }
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Your accounts</h2>
        {accounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-foreground">You don&apos;t have any accounts yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Open your first checking or savings account to start banking with Sky Bank.
              </p>
              <OpenAccountDialog trigger={<Button>Open your first account</Button>} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <TransferForm accounts={accounts} />
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/transactions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

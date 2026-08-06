import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TransactionList } from "@/components/transaction-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, maskAccountNumber } from "@/lib/format"
import type { Account, Transaction } from "@/lib/types"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>
}) {
  const { account: accountFilter } = await searchParams
  const supabase = await createClient()

  const { data: accountsData } = await supabase.from("accounts").select("*").order("created_at", { ascending: true })
  const accounts = (accountsData ?? []) as Account[]

  let query = supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(200)
  if (accountFilter) query = query.eq("account_id", accountFilter)

  const { data: transactionsData } = await query
  const transactions = (transactionsData ?? []) as Transaction[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transaction history</h1>
          <p className="text-sm text-muted-foreground">A complete record of deposits and transfers.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant={accountFilter ? "outline" : "default"}>
          <Link href="/dashboard/transactions">All accounts</Link>
        </Button>
        {accounts.map((account) => (
          <Button
            key={account.id}
            asChild
            size="sm"
            variant={accountFilter === account.id ? "default" : "outline"}
          >
            <Link href={`/dashboard/transactions?account=${account.id}`}>
              {account.name} ({maskAccountNumber(account.account_number)})
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {transactions.length} {transactions.length === 1 ? "transaction" : "transactions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}

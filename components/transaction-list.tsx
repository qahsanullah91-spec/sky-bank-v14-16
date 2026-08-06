import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

const LABELS: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer_in: "Transfer received",
  transfer_out: "Transfer sent",
}

function isCredit(type: Transaction["type"]) {
  return type === "deposit" || type === "transfer_in"
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-12 text-center">
        <p className="text-sm font-medium text-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground">Deposits and transfers will appear here.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {transactions.map((txn) => {
        const credit = isCredit(txn.type)
        return (
          <li key={txn.id} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm",
                  credit ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {credit ? "+" : "−"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {txn.description || LABELS[txn.type]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {LABELS[txn.type]}
                  {txn.counterparty ? ` • ${txn.counterparty}` : ""} • {formatDateTime(txn.created_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn("font-mono text-sm font-semibold", credit ? "text-primary" : "text-foreground")}>
                {credit ? "+" : "−"}
                {formatCurrency(txn.amount)}
              </p>
              <p className="font-mono text-xs text-muted-foreground">{formatCurrency(txn.balance_after)}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DepositDialog } from "@/components/deposit-dialog"
import { formatCurrency } from "@/lib/format"
import type { Account } from "@/lib/types"

export function AccountCard({ account }: { account: Account }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between bg-primary px-5 py-4 text-primary-foreground">
        <div>
          <p className="text-sm font-medium capitalize opacity-90">{account.account_type}</p>
          <p className="text-lg font-semibold leading-tight">{account.name}</p>
        </div>
        <Badge
          className={
            account.status === "active"
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
          }
        >
          {account.status}
        </Badge>
      </div>
      <CardContent className="flex flex-col gap-4 pt-5">
        <div>
          <p className="text-sm text-muted-foreground">Available balance</p>
          <p className="font-mono text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(account.balance, account.currency)}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Account number</p>
            <p className="font-mono text-sm text-foreground">{account.account_number}</p>
          </div>
          <DepositDialog
            account={account}
            trigger={
              <Button size="sm" variant="outline">
                Deposit
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

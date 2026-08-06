"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { transfer } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/format"
import type { Account } from "@/lib/types"

export function TransferForm({ accounts }: { accounts: Account[] }) {
  const activeAccounts = accounts.filter((a) => a.status === "active")
  const [fromAccountId, setFromAccountId] = useState(activeAccounts[0]?.id ?? "")
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("from_account_id", fromAccountId)
    startTransition(async () => {
      const result = await transfer(formData)
      if (result.ok) {
        setMessage({ type: "success", text: "Transfer completed successfully." })
        form.reset()
      } else {
        setMessage({ type: "error", text: result.error })
      }
    })
  }

  if (activeAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send money</CardTitle>
          <CardDescription>Open an account to start sending transfers.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send money</CardTitle>
        <CardDescription>Transfer to any Sky Bank account by its 10-digit number.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="from_account">From</Label>
            <Select value={fromAccountId} onValueChange={setFromAccountId}>
              <SelectTrigger id="from_account">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} — {formatCurrency(account.balance, account.currency)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="to_account_number">To account number</Label>
            <Input
              id="to_account_number"
              name="to_account_number"
              inputMode="numeric"
              pattern="\d{10}"
              placeholder="10-digit account number"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Note (optional)</Label>
            <Input id="description" name="description" placeholder="Rent" maxLength={140} />
          </div>
          {message && (
            <p
              className={message.type === "error" ? "text-sm text-destructive" : "text-sm text-primary"}
              role={message.type === "error" ? "alert" : "status"}
            >
              {message.text}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Sending..." : "Send transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

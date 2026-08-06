"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { openAccount } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OpenAccountDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [accountType, setAccountType] = useState("checking")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set("account_type", accountType)
    startTransition(async () => {
      const result = await openAccount(formData)
      if (result.ok) {
        setOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open a new account</DialogTitle>
          <DialogDescription>Choose an account type and an optional opening deposit.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Account name</Label>
            <Input id="name" name="name" placeholder="Everyday Checking" required maxLength={60} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="account_type">Account type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger id="account_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="opening_deposit">Opening deposit (optional)</Label>
            <Input
              id="opening_deposit"
              name="opening_deposit"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              defaultValue="0"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Opening..." : "Open account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

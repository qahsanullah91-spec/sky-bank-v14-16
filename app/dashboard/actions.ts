"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function openAccount(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in." }

  const name = String(formData.get("name") ?? "").trim()
  const accountType = String(formData.get("account_type") ?? "")
  const openingDeposit = Number(formData.get("opening_deposit") ?? 0)

  if (!name) return { ok: false, error: "Account name is required." }
  if (accountType !== "checking" && accountType !== "savings") {
    return { ok: false, error: "Choose a valid account type." }
  }
  if (!Number.isFinite(openingDeposit) || openingDeposit < 0) {
    return { ok: false, error: "Opening deposit must be zero or more." }
  }

  const { error } = await supabase.rpc("open_account", {
    p_name: name,
    p_account_type: accountType,
    p_opening_deposit: openingDeposit,
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath("/dashboard")
  return { ok: true }
}

export async function deposit(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in." }

  const accountId = String(formData.get("account_id") ?? "")
  const amount = Number(formData.get("amount") ?? 0)
  const description = String(formData.get("description") ?? "Deposit").trim()

  if (!accountId) return { ok: false, error: "Select an account." }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero." }
  }

  const { error } = await supabase.rpc("deposit", {
    p_account_id: accountId,
    p_amount: amount,
    p_description: description || "Deposit",
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath("/dashboard")
  return { ok: true }
}

export async function transfer(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in." }

  const fromAccountId = String(formData.get("from_account_id") ?? "")
  const toAccountNumber = String(formData.get("to_account_number") ?? "").trim()
  const amount = Number(formData.get("amount") ?? 0)
  const description = String(formData.get("description") ?? "").trim()

  if (!fromAccountId) return { ok: false, error: "Select a source account." }
  if (!/^\d{10}$/.test(toAccountNumber)) {
    return { ok: false, error: "Enter a valid 10-digit destination account number." }
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero." }
  }

  const { error } = await supabase.rpc("transfer", {
    p_from_account_id: fromAccountId,
    p_to_account_number: toAccountNumber,
    p_amount: amount,
    p_description: description || null,
  })

  if (error) {
    // RPC raises human-readable messages (Insufficient funds, etc.)
    return { ok: false, error: error.message.replace(/^.*?:\s*/, "") }
  }

  revalidatePath("/dashboard")
  return { ok: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

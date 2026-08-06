export type AccountType = "checking" | "savings"
export type AccountStatus = "active" | "frozen" | "closed"
export type TransactionType = "deposit" | "withdrawal" | "transfer_in" | "transfer_out"

export interface Account {
  id: string
  user_id: string
  account_number: string
  name: string
  account_type: AccountType
  balance: number
  currency: string
  status: AccountStatus
  created_at: string
}

export interface Transaction {
  id: string
  account_id: string
  user_id: string
  type: TransactionType
  amount: number
  balance_after: number
  description: string | null
  counterparty: string | null
  created_at: string
}

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  created_at: string
}

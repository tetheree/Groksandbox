export type Band = 'fresh' | 'recent' | 'cooling' | 'unchanged'

export type Account = {
  id: string
  name: string
  kind: string
  lastLineChange: string
  lineText: string
  coveredWeeks: string[]
  staleExample?: boolean
}

export type BookFile = {
  asOf: string
  windowWeeks: number
  windowMonths: number
  book: {
    customers: number
    contacts: number
    huddleLines: number
    opportunityTable: string
  }
  accounts: Account[]
}

export type WeekCell = {
  iso: string
  covered: boolean
}

export type MonthCell = {
  ym: string
  weeksCovered: number
}

export type AccountView = Account & {
  weeksUnchanged: number
  band: Band
  weeks: WeekCell[]
  months: MonthCell[]
  coveredInWindow: number
}

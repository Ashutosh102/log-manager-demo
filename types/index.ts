export interface Log {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  source: string
  message: string
}

export interface Filter {
  startDate?: Date
  endDate?: Date
  level?: string
  keyword?: string
}

export interface Alert {
  id: string
  severity: "success" | "info" | "warning" | "error"
  title: string
  message: string
  timestamp: string
}

export interface UserPreferences {
  visibleColumns: string[]
  columnWidths: { [key: number]: number }
}


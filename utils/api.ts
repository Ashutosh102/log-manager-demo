// utils/api.ts

import type { Log, Filter, Alert, UserPreferences } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function fetchLogs(filters: Filter): Promise<Log[]> {
  const queryParams = new URLSearchParams()
  if (filters.startDate) queryParams.append("startDate", filters.startDate.toISOString())
  if (filters.endDate) queryParams.append("endDate", filters.endDate.toISOString())
  if (filters.level) queryParams.append("level", filters.level)
  if (filters.keyword) queryParams.append("keyword", filters.keyword)

  const response = await fetch(`${API_URL}/logs?${queryParams.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch logs")
  }
  return response.json()
}

export function subscribeToLogs(callback: (data: { type: string; data: Log | Alert | Alert[] }) => void): () => void {
  const socket = new WebSocket(`${API_URL.replace("http", "ws")}/logs`)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data)
  }

  return () => {
    socket.close()
  }
}

export async function fetchUserPreferences(userId: string): Promise<UserPreferences> {
  const response = await fetch(`${API_URL}/preferences/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user preferences")
  }
  return response.json()
}

export async function saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  const response = await fetch(`${API_URL}/preferences/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ preferences }),
  })
  if (!response.ok) {
    throw new Error("Failed to save user preferences")
  }
}

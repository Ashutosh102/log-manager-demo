const express = require("express")
const http = require("http")
const WebSocket = require("ws")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")
const { Parser } = require("json2csv")
const cron = require("node-cron")

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(cors())
app.use(express.json())

let logs = []
const alerts = []
const bookmarks = []
const userPreferences = {}

// Alert counters
let errorRateAlertCount = 0
let highErrorRateAlertCount = 0

// Auto-delete logs older than 5 days
cron.schedule("0 0 * * *", () => {
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  logs = logs.filter((log) => new Date(log.timestamp) > fiveDaysAgo)
  console.log("Auto-deleted old logs")
})

// Helper function to check for alerts
function checkForAlerts() {
  const now = Date.now()
  const tenMinutesAgo = now - 10 * 60 * 1000
  const oneHourAgo = now - 60 * 60 * 1000

  // Check for more than 50 error logs in the last 10 minutes
  const recentErrorLogs = logs.filter((log) => log.level === "error" && new Date(log.timestamp) > tenMinutesAgo)
  if (recentErrorLogs.length > 50 && highErrorRateAlertCount < 2) {
    createAlert("High Error Rate", "More than 50 error logs in the last 10 minutes", "error")
    highErrorRateAlertCount++
  } else if (recentErrorLogs.length <= 50) {
    highErrorRateAlertCount = 0 // Reset counter if condition is not met
  }

  // Check for error or warning logs exceeding 50% in the last hour
  const recentLogs = logs.filter((log) => new Date(log.timestamp) > oneHourAgo)
  const errorWarningLogs = recentLogs.filter((log) => log.level === "error")
  if (recentLogs.length > 0 && errorWarningLogs.length / recentLogs.length > 0.5 && errorRateAlertCount < 2) {
    createAlert("High Error Rate", "Error logs exceed 50% of all logs in the last hour", "error")
    errorRateAlertCount++
  } else if (recentLogs.length === 0 || errorWarningLogs.length / recentLogs.length <= 0.5) {
    errorRateAlertCount = 0 // Reset counter if condition is not met
  }
}

function createAlert(title, message, severity) {
  const alert = {
    id: uuidv4(),
    title,
    message,
    severity,
    timestamp: new Date().toISOString(),
  }
  alerts.push(alert)
  broadcastAlert(alert)
}

function broadcastAlert(alert) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "alert", data: alert }))
    }
  })
}

app.get("/logs", (req, res) => {
  const { startDate, endDate, level, keyword } = req.query
  let filteredLogs = [...logs]

  if (startDate) {
    filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(startDate))
  }
  if (endDate) {
    filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= new Date(endDate))
  }
  if (level) {
    filteredLogs = filteredLogs.filter((log) => log.level === level)
  }
  if (keyword) {
    filteredLogs = filteredLogs.filter((log) => log.message.toLowerCase().includes(keyword.toLowerCase()))
  }

  res.json(filteredLogs)
})

app.get("/export", (req, res) => {
  const { format } = req.query
  const data = logs

  if (format === "csv") {
    const fields = ["id", "timestamp", "level", "source", "message"]
    const parser = new Parser({ fields })
    const csv = parser.parse(data)
    res.header("Content-Type", "text/csv")
    res.attachment("logs.csv")
    return res.send(csv)
  } else {
    res.header("Content-Type", "application/json")
    res.attachment("logs.json")
    return res.send(JSON.stringify(data, null, 2))
  }
})

app.post("/bookmarks", (req, res) => {
  const { logId } = req.body
  const log = logs.find((l) => l.id === logId)
  if (log) {
    const bookmark = { ...log, bookmarkId: uuidv4() }
    bookmarks.push(bookmark)
    res.json(bookmark)
  } else {
    res.status(404).json({ error: "Log not found" })
  }
})

app.get("/bookmarks", (req, res) => {
  res.json(bookmarks)
})

app.delete("/bookmarks/:id", (req, res) => {
  const { id } = req.params
  const index = bookmarks.findIndex((b) => b.bookmarkId === id)
  if (index !== -1) {
    bookmarks.splice(index, 1)
    res.status(204).send()
  } else {
    res.status(404).json({ error: "Bookmark not found" })
  }
})

app.get("/dashboard", (req, res) => {
  const errorCount = logs.filter((log) => log.level === "error").length
  const warningCount = logs.filter((log) => log.level === "warning").length
  const infoCount = logs.filter((log) => log.level === "info").length

  const hourlyData = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - i)
    const hourLogs = logs.filter(
      (log) => new Date(log.timestamp) >= hour && new Date(log.timestamp) < new Date(hour.getTime() + 3600000),
    )
    const errorRate = hourLogs.length > 0 ? hourLogs.filter((log) => log.level === "error").length / hourLogs.length : 0
    hourlyData.push({
      hour: hour.toISOString(),
      errorRate: errorRate,
    })
  }

  res.json({
    counts: { error: errorCount, warning: warningCount, info: infoCount },
    hourlyErrorRate: hourlyData,
  })
})

// User preferences endpoints
app.get("/preferences/:userId", (req, res) => {
  const { userId } = req.params
  const defaultPreferences = {
    visibleColumns: ["timestamp", "level", "source", "message", "actions"],
    columnWidths: {},
  }
  res.json(userPreferences[userId] || defaultPreferences)
})


app.post("/preferences/:userId", (req, res) => {
  const { userId } = req.params
  const { preferences } = req.body
  userPreferences[userId] = preferences
  res.status(200).json({ message: "Preferences saved successfully" })
})

wss.on("connection", (ws) => {
  console.log("Client connected")

  // Send existing alerts to the new client
  ws.send(JSON.stringify({ type: "alerts", data: alerts }))

  // Send a new log every 5 seconds
  const interval = setInterval(() => {
    const newLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level: ["info", "warning", "error"][Math.floor(Math.random() * 3)],
      source: ["frontend", "backend", "database"][Math.floor(Math.random() * 3)],
      message: `Log message ${Date.now()}`,
    }
    logs.unshift(newLog)
    ws.send(JSON.stringify({ type: "log", data: newLog }))

    checkForAlerts()
  }, 5000)

  ws.on("close", () => {
    console.log("Client disconnected")
    clearInterval(interval)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

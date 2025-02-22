"use client"

import { useState, useCallback } from "react"
import { Table, Typography, Button, message } from "antd"
import { BookOutlined } from "@ant-design/icons"
import type { Log, UserPreferences } from "@/types"
import LogDetailView from "./LogDetailView"

const { Text } = Typography

interface LogTableProps {
  logs: Log[]
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
}

export default function LogTable({ logs, preferences, onPreferencesChange }: LogTableProps) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  const handleBookmark = async (log: Log) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logId: log.id }),
      })

      if (response.ok) {
        message.success("Log bookmarked successfully")
      } else {
        throw new Error("Failed to bookmark log")
      }
    } catch (error) {
      console.error("Error bookmarking log:", error)
      message.error("Failed to bookmark log")
    }
  }

  const handleResizeColumn = useCallback(
    (index: number, newWidth: number) => {
      const newColumnWidths = { ...preferences.columnWidths, [index]: newWidth }
      onPreferencesChange({ ...preferences, columnWidths: newColumnWidths })
    },
    [preferences, onPreferencesChange],
  )

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text: string) => <Text style={{ color: "var(--text-color)" }}>{new Date(text).toLocaleString()}</Text>,
      width: 200,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: (e: any, { size }: { size: { width: number } }) => {
          handleResizeColumn(0, size.width)
        },
      }),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (text: string) => (
        <Text
          style={{
            color: text === "error" ? "#ff4d4f" : text === "warning" ? "#faad14" : "#52c41a",
          }}
        >
          {text.toUpperCase()}
        </Text>
      ),
      width: 100,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: (e: any, { size }: { size: { width: number } }) => {
          handleResizeColumn(1, size.width)
        },
      }),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (text: string) => <Text style={{ color: "var(--text-color)" }}>{text}</Text>,
      width: 150,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: (e: any, { size }: { size: { width: number } }) => {
          handleResizeColumn(2, size.width)
        },
      }),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string) => <Text style={{ color: "var(--text-color)" }}>{text}</Text>,
      width: 300,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: (e: any, { size }: { size: { width: number } }) => {
          handleResizeColumn(3, size.width)
        },
      }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Log) => (
        <Button icon={<BookOutlined />} onClick={() => handleBookmark(record)}>
          Bookmark
        </Button>
      ),
      width: 100,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: (e: any, { size }: { size: { width: number } }) => {
          handleResizeColumn(4, size.width)
        },
      }),
    },
  ].filter((column) => preferences?.visibleColumns?.includes(column.key))

  return (
    <>
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => setSelectedLog(record),
        })}
        style={{ marginTop: "16px", backgroundColor: "var(--background-color)" }}
        components={{
          header: {
            cell: (props: any) => <th {...props} style={{ ...props.style, cursor: "col-resize" }} />,
          },
        }}
      />
      <LogDetailView log={selectedLog} onClose={() => setSelectedLog(null)} />
    </>
  )
}

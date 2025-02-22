"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Table, Button, message } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import type { Log } from "@/types"

const Bookmarks: React.FC = () => {
    const [bookmarks, setBookmarks] = useState<Log[]>([])

    useEffect(() => {
        fetchBookmarks()
    }, [])

    const fetchBookmarks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`)
            const data = await response.json()
            setBookmarks(data)
        } catch (error) {
            console.error("Error fetching bookmarks:", error)
            message.error("Failed to fetch bookmarks")
        }
    }

    const handleDeleteBookmark = async (bookmarkId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${bookmarkId}`, {
                method: "DELETE",
            })
            setBookmarks(bookmarks.filter((bookmark) => bookmark.bookmarkId !== bookmarkId))
            message.success("Bookmark deleted successfully")
        } catch (error) {
            console.error("Error deleting bookmark:", error)
            message.error("Failed to delete bookmark")
        }
    }

    const columns = [
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: "Level",
            dataIndex: "level",
            key: "level",
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
        },
        {
            title: "Action",
            key: "action",
            render: (text: string, record: Log) => (
                <Button icon={<DeleteOutlined />} onClick={() => handleDeleteBookmark(record.bookmarkId)} danger>
                    Delete
                </Button>
            ),
        },
    ]

    return <Table columns={columns} dataSource={bookmarks} rowKey="bookmarkId" />
}

export default Bookmarks


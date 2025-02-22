import type React from "react"
import { Button, Dropdown, Menu, message } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import type { Log } from "@/types"
import { Parser } from "json2csv"

interface ExportButtonProps {
    logs: Log[]
}

const ExportButton: React.FC<ExportButtonProps> = ({ logs }) => {
    const handleExport = async (format: "csv" | "json") => {
        try {
            let content: string
            let fileName: string
            let mimeType: string

            if (format === "csv") {
                const fields = ["id", "timestamp", "level", "source", "message"]
                const parser = new Parser({ fields })
                content = parser.parse(logs)
                fileName = "logs.csv"
                mimeType = "text/csv"
            } else {
                content = JSON.stringify(logs, null, 2)
                fileName = "logs.json"
                mimeType = "application/json"
            }

            const blob = new Blob([content], { type: mimeType })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            message.success(`Logs exported as ${format.toUpperCase()}`)
        } catch (error) {
            console.error("Error exporting logs:", error)
            message.error("Failed to export logs")
        }
    }

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => handleExport("csv")}>
                Export as CSV
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handleExport("json")}>
                Export as JSON
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={menu} placement="bottomRight">
            <Button icon={<DownloadOutlined />}>Export</Button>
        </Dropdown>
    )
}

export default ExportButton


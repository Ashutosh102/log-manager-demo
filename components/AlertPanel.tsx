import { Alert, Space, Button } from "antd"
import type { Alert as AlertType } from "@/types"

interface AlertPanelProps {
  alerts: AlertType[]
  onDeleteAlert: (alertId: string) => void
}

export default function AlertPanel({ alerts, onDeleteAlert }: AlertPanelProps) {
  return (
    <Space direction="vertical" style={{ width: "100%", marginTop: "16px", marginBottom: "16px" }}>
      {alerts.slice(0, 5).map((alert) => (
        <Alert
          key={alert.id}
          message={alert.title}
          description={
            <div>
              {alert.message}
              <Button
                type="link"
                onClick={() => onDeleteAlert(alert.id)}
                style={{ marginLeft: "8px" }}
              >
                Delete
              </Button>
            </div>
          }
          type={alert.severity}
          showIcon
        />
      ))}
    </Space>
  )
}

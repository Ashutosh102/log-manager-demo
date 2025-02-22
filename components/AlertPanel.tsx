import { Alert, Space, Button } from "antd"
import type { Alert as AlertType } from "@/types"

interface AlertPanelProps {
  alerts: AlertType[]
  onDeleteAlert: (alertId: string) => void
  onDeleteAllAlerts: () => void
}

export default function AlertPanel({ alerts, onDeleteAlert, onDeleteAllAlerts }: AlertPanelProps) {
  return (
    <Space direction="vertical" style={{ width: "100%", marginTop: "16px", marginBottom: "16px" }}>
      <Button type="primary" danger onClick={onDeleteAllAlerts} disabled={alerts.length === 0}>
        Delete All
      </Button>
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

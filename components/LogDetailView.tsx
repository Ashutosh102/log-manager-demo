import { Modal, Descriptions } from "antd"
import type { Log } from "@/types"

interface LogDetailViewProps {
  log: Log | null
  onClose: () => void
}

export default function LogDetailView({ log, onClose }: LogDetailViewProps) {
  if (!log) return null

  return (
    <Modal title="Log Details" open={!!log} onCancel={onClose} footer={null} width={600}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{log.id}</Descriptions.Item>
        <Descriptions.Item label="Timestamp">{new Date(log.timestamp).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Level">{log.level.toUpperCase()}</Descriptions.Item>
        <Descriptions.Item label="Source">{log.source}</Descriptions.Item>
        <Descriptions.Item label="Message">{log.message}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}


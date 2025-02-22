import { Card, DatePicker, Select, Input, Button, Switch, Space, Form } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import type { Filter } from "@/types"

const { RangePicker } = DatePicker

interface FilterPanelProps {
  onFilterChange: (filters: Filter) => void
  autoRefresh: boolean
  onAutoRefreshToggle: () => void
}

export default function FilterPanel({ onFilterChange, autoRefresh, onAutoRefreshToggle }: FilterPanelProps) {
  const [form] = Form.useForm()

  const handleApplyFilters = () => {
    const values = form.getFieldsValue()
    const filters: Filter = {}
    if (values.dateRange) {
      filters.startDate = values.dateRange[0].toDate()
      filters.endDate = values.dateRange[1].toDate()
    }
    if (values.level) filters.level = values.level
    if (values.keyword) filters.keyword = values.keyword
    onFilterChange(filters)
  }

  return (
    <Card style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
      <Form form={form} layout="inline" onFinish={handleApplyFilters}>
        <Form.Item name="dateRange">
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="level">
          <Select style={{ width: 120 }} placeholder="Log Level">
            <Select.Option value="">All</Select.Option>
            <Select.Option value="info">Info</Select.Option>
            <Select.Option value="warning">Warning</Select.Option>
            <Select.Option value="error">Error</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="keyword">
          <Input placeholder="Keyword" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              Apply Filters
            </Button>
            <Switch
              checkedChildren="Auto Refresh"
              unCheckedChildren="Manual"
              checked={autoRefresh}
              onChange={onAutoRefreshToggle}
            />
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}


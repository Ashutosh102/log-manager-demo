"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, Row, Col, Statistic } from "antd"
import { Line, Pie } from "@ant-design/charts"

interface DashboardData {
  counts: {
    error: number
    warning: number
    info: number
  }
  hourlyErrorRate: {
    hour: string
    errorRate: number
  }[]
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      const dashboardData = await response.json()
      setData(dashboardData)
    }

    fetchDashboardData()
  }, [])

  if (!data) {
    return <div>Loading dashboard data...</div>
  }

  const pieConfig = {
    data: [
      { type: "Error", value: data.counts.error },
      { type: "Warning", value: data.counts.warning },
      { type: "Info", value: data.counts.info },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      content: (data) => `${data.type}: ${(data.percent * 100).toFixed(2)}%`,
      style: {
        fill: 'var(--chart-label-color)', // Use the custom property for label color
      },
    },
  }

  const lineConfig = {
    data: data.hourlyErrorRate,
    xField: "hour",
    yField: "errorRate",
    seriesField: "errorRate",
    yAxis: {
      label: {
        formatter: (v: string) => `${Number(v) * 100}%`,
        style: {
          fill: 'var(--chart-label-color)', // Use the custom property for label color
        },
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: "Error Rate", value: `${(datum.errorRate * 100).toFixed(2)}%` }
      },
    },
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Errors" value={data.counts.error} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Warnings" value={data.counts.warning} valueStyle={{ color: "#faad14" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Info Logs" value={data.counts.info} valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col span={12}>
          <Card title="Log Type Distribution">
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Hourly Error Rate">
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

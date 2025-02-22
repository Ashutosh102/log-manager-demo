"use client"

import { useState, useEffect } from "react"
import { Layout, Typography, ConfigProvider, theme, Switch, notification, Menu, Button, Drawer } from "antd"
import {
  BulbOutlined,
  BulbFilled,
  DashboardOutlined,
  UnorderedListOutlined,
  BookOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons"
import { useMediaQuery } from "react-responsive"
import LogTable from "@/components/LogTable"
import FilterPanel from "@/components/FilterPanel"
import AlertPanel from "@/components/AlertPanel"
import LoadingScreen from "@/components/LoadingScreen"
import ExportButton from "@/components/ExportButton"
import Dashboard from "@/components/Dashboard"
import Bookmarks from "@/components/Bookmarks"
import Settings from "@/components/Settings"
import type { Log, Filter, Alert, UserPreferences } from "@/types"
import { fetchLogs, subscribeToLogs, fetchUserPreferences, saveUserPreferences } from "@/utils/api"

const { Header, Content, Sider } = Layout
const { Title } = Typography

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([])
  const [filters, setFilters] = useState<Filter>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [currentPage, setCurrentPage] = useState("logs")
  const [collapsed, setCollapsed] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    visibleColumns: ["timestamp", "level", "source", "message"],
    columnWidths: {},
  })

  // Media query to detect small screens
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [initialLogs, preferences] = await Promise.all([
          fetchLogs(filters),
          fetchUserPreferences("user1"),
        ])
        setLogs(initialLogs)
        setUserPreferences(preferences)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()

    const unsubscribe = subscribeToLogs((data) => {
      if (data.type === "log" && autoRefresh) {
        setLogs((prevLogs) => [data.data, ...prevLogs])
      } else if (data.type === "alert") {
        setAlerts((prevAlerts) => [data.data, ...prevAlerts])
        showNotification(data.data)
      } else if (data.type === "alerts") {
        setAlerts(data.data)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [filters, autoRefresh])

  const handleFilterChange = (newFilters: Filter) => {
    setFilters(newFilters)
  }

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const showNotification = (alert: Alert) => {
    notification.open({
      message: alert.title,
      description: alert.message,
      duration: 0,
      placement: "topRight",
      type: alert.severity,
    })

    if (Notification.permission === "granted") {
      new Notification(alert.title, { body: alert.message })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(alert.title, { body: alert.message })
        }
      })
    }
  }

  const handlePreferencesChange = async (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences)
    await saveUserPreferences("user1", newPreferences)
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId))
  }

  const handleMenuSelect = ({ key }: { key: string }) => {
    setCurrentPage(key)
    if (isMobile) {
      setDrawerVisible(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "Poppins, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            theme={darkMode ? "dark" : "light"}
            width={200}
          >
            <Menu
              mode="inline"
              selectedKeys={[currentPage]}
              style={{ height: "100%", borderRight: 0 }}
              onSelect={handleMenuSelect}
            >
              <Menu.Item key="logs" icon={<UnorderedListOutlined />}>
                Logs
              </Menu.Item>
              <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="bookmarks" icon={<BookOutlined />}>
                Bookmarks
              </Menu.Item>
              <Menu.Item key="settings" icon={<SettingOutlined />}>
                Settings
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: darkMode ? "#002140" : "#e6f4ff", padding: isMobile ? "0 16px" : "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerVisible(true)}
                  style={{ marginRight: "16px" }}
                />
              )}
              <Title level={isMobile ? 4 : 3} style={{ color: darkMode ? "white" : "black", margin: 0 }}>
                Log Management System
              </Title>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ExportButton logs={logs} />
              <Switch
                checkedChildren={<BulbOutlined />}
                unCheckedChildren={<BulbFilled />}
                checked={darkMode}
                onChange={toggleDarkMode}
                style={{ marginLeft: "16px" }}
              />
            </div>
          </Header>
          <Content style={{ padding: "24px" }}>
            <AlertPanel alerts={alerts} onDeleteAlert={handleDeleteAlert} />
            {currentPage === "logs" && (
              <>
                <FilterPanel
                  onFilterChange={handleFilterChange}
                  autoRefresh={autoRefresh}
                  onAutoRefreshToggle={handleAutoRefreshToggle}
                />
                <LogTable logs={logs} preferences={userPreferences} onPreferencesChange={handlePreferencesChange} />
              </>
            )}
            {currentPage === "dashboard" && <Dashboard />}
            {currentPage === "bookmarks" && <Bookmarks />}
            {currentPage === "settings" && (
              <Settings preferences={userPreferences} onPreferencesChange={handlePreferencesChange} />
            )}
          </Content>
        </Layout>
      </Layout>
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          onSelect={handleMenuSelect}
        >
          <Menu.Item key="logs" icon={<UnorderedListOutlined />}>
            Logs
          </Menu.Item>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="bookmarks" icon={<BookOutlined />}>
            Bookmarks
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Drawer>
    </ConfigProvider>
  )
}

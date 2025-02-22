import type React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />

const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        transition: "all 0.3s ease",
      }}
    >
      <Spin indicator={antIcon} />
      <h2
        style={{
          marginTop: "20px",
          fontSize: "24px",
          fontWeight: 500,
          animation: "pulse 2s infinite",
        }}
      >
        Logs are getting loaded
      </h2>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen


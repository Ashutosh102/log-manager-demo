# 📜 Log Management System

## 🚀 Overview
The **Log Management System** is a powerful and real-time logging platform designed to help system administrators monitor, filter, and analyze logs effectively. Built with **Next.js, React, Node.js, and WebSockets**, it provides real-time updates, custom alerts, detailed log insights, and export functionality.

![Log Management](https://img.shields.io/badge/Log%20Management-RealTime-blue.svg) ![Version](https://img.shields.io/badge/Version-1.0-green) ![License](https://img.shields.io/badge/License-ISC-orange)

---

## ✨ Features

### 🔥 Real-time Log Monitoring
- View logs in a **table format** with timestamps, log levels, sources, and messages.
- **Auto-refresh logs** every 5 seconds with a toggle to enable/disable real-time updates.

### 🔎 Advanced Filtering
- **Filter logs by:**
  - **📅 Date Range** (Start & End date)
  - **📌 Log Level** (Info, Warning, Error)
  - **🔍 Keyword Search** (Search within log messages)

### 🚨 Custom Alerts
- Trigger alerts based on log conditions:
  - If **Error logs exceed 50 times in 10 minutes**.
  - If **Error/Warning logs exceed 50% of total logs** in the last hour.
  - **Show UI popups** for triggered alerts.

### 📊 Log Statistics Dashboard
- Graphical insights with **charts and graphs**.
- Count of Errors, Warnings, and Info logs.
- Error rate trends over time.

### 📁 Export & Bookmarking
- Export logs in **CSV or JSON format**.
- Bookmark important logs for later reference.

### ⏳ Auto-Cleanup
- **Automatically delete logs** older than a specified time (e.g., 5 days).

### 🎨 Customizable Views & Dark Mode
- Choose visible columns, resize, and save view settings.
- Switch between **light & dark mode** for a comfortable experience.

---

## 🛠️ Tech Stack

### 🏗 Frontend
- **Next.js** (14.2.16)
- **React** (18)
- **Tailwind CSS**
- **Radix UI Components**
- **Ant Design Charts & UI**

### ⚙ Backend
- **Node.js & Express**
- **WebSockets (ws)** for real-time updates
- **JSON2CSV** for log exports
- **Node-cron** for scheduling auto-cleanup

---

## 📦 Installation & Setup

### Clone the repository
```sh
git clone https://github.com/Ashutosh102/log-manager-demo.git
cd log-manager-demo
```

### 🔧 Frontend Setup
```sh
npm install
npm run dev
```

### ⚡ Backend Setup
```sh
npm install
npm run backend-dev
```

> **Note:** Ensure **Node.js (v16+)** is installed on your system.

---


## 🤝 Contributing
Want to improve this project? Feel free to fork and contribute! 🚀

```sh
git clone https://github.com/Ashutosh102/log-manager-demo.git
cd log-manager-demo
git checkout -b feature-branch
```

---

## 📜 License
This project is licensed under the **ISC License**.

---

## 📬 Contact
For any inquiries, feel free to connect:
- **Author:** Ashutosh Mohanty  
- **Email:** ashutoshmohanty3815@gmail.com  
- **GitHub:** [@DevAshu](https://github.com/Ashutosh102)  
- **LinkedIn:** [Ashutosh Mohanty](https://linkedin.com/in/devashu)

---

⭐ If you like this project, consider giving it a **star** on GitHub! ⭐


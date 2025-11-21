# E-Hiker 登山客入山申請系統

一個基於 Vue 3 的現代化登山客入山申請網站，提供便捷的線上申請和狀態查詢服務。

## 功能特色

- 🏔️ **線上申請** - 簡單填寫表單，快速完成入山申請
- 📊 **狀態查詢** - 隨時查詢申請進度，掌握最新審核狀態
- 🔔 **安全提醒** - 提供登山安全資訊與天氣預報服務
- 📱 **響應式設計** - 支援各種裝置，隨時隨地使用
- 🎨 **現代化界面** - 使用 Element Plus 打造美觀易用的界面

## 技術棧

- **前端框架**: Vue 3 (Composition API)
- **UI 組件庫**: Element Plus
- **路由管理**: Vue Router 4
- **狀態管理**: Pinia
- **建構工具**: Vite
- **樣式預處理**: Sass
- **圖標**: Element Plus Icons

## 專案結構

```
e-hiker/
├── public/                 # 靜態資源
├── src/
│   ├── components/         # 可重用組件
│   │   ├── NavBar.vue     # 導航欄
│   │   └── Footer.vue     # 頁腳
│   ├── views/             # 頁面組件
│   │   ├── Home.vue       # 首頁
│   │   ├── Application.vue # 申請表單
│   │   ├── Status.vue     # 狀態查詢
│   │   └── About.vue      # 關於我們
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── stores/            # 狀態管理
│   ├── App.vue            # 根組件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── package.json           # 專案配置
├── vite.config.js         # Vite 配置
└── README.md              # 專案說明
```

## 快速開始

### 環境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

專案將在 `http://localhost:3000` 啟動

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 頁面說明

### 首頁 (Home)
- 系統介紹和功能展示
- 快速申請入口
- 最新公告和通知

### 申請入山 (Application)
- 完整的入山申請表單
- 包含個人資料、登山資訊、緊急聯絡人等
- 表單驗證和錯誤提示

### 查詢狀態 (Status)
- 使用申請編號或身分證字號查詢
- 顯示申請進度和審核狀態
- 狀態說明和流程介紹

### 關於我們 (About)
- 系統介紹和服務特色
- 聯絡方式和客服資訊
- 登山安全須知

## 開發指南

### 添加新頁面

1. 在 `src/views/` 創建新的 Vue 組件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/components/NavBar.vue` 中添加導航項目

### 自定義樣式

- 全局樣式在 `src/App.vue` 中定義
- 組件樣式使用 `<style scoped>` 進行封裝
- 支援 Sass 預處理器

### 狀態管理

使用 Pinia 進行狀態管理，可以在 `src/stores/` 中創建 store 文件。

## 部署說明

### 靜態部署

1. 執行 `npm run build` 建構專案
2. 將 `dist` 目錄中的文件上傳到靜態文件服務器

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 瀏覽器支援

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 授權

MIT License

## 聯絡我們

如有問題或建議，請聯絡：

- 電子信箱：service@e-hiker.com
- 客服電話：02-1234-5678

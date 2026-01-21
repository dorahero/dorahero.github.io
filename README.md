# Personal Resume Website (個人履歷網頁)

這是一個現代化、風格明亮且具科技感的個人履歷網站專案。使用 **Vue 3** + **Vite** 構建，並搭配純 CSS (Vanilla CSS) 實現高效能且優雅的視覺效果。

![設計預覽圖](./public/preview.png)

## ✨ 特色

- **現代科技感**: 採用毛玻璃 (Glassmorphism) 效果、細緻陰影與流暢的轉場動畫。
- **圓角設計**: 統一的大圓角風格，介面親和且現代。
- **響應式佈局**: 完美支援桌面與行動裝置瀏覽。
- **高效能**: 基於 Vite 與 Vue 3 Composition API 開發。
- **圖示整合**: 使用 Lucide Vue 提供高品質的向量圖示。

## 🛠️ 技術棧

- **Core**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Modern Vanilla CSS (CSS Variables)
- **Icons**: Lucide Vue

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```
啟動後即可在瀏覽器中預覽 (預設: `http://localhost:5173`)。

### 📱 手機測試 (Mobile Testing)

若要在手機上即時預覽：

1. 確保手機與電腦連接至**同一個 Wi-Fi 網路**。
2. 執行以下指令啟動伺服器：
   ```bash
   npm run dev -- --host
   ```
3. 查看終端機顯示的 `Network` 網址（例如 `http://192.168.x.x:5173/`）。
4. 在手機瀏覽器輸入該網址即可預覽。

### 3. 建置生產版本

```bash
npm run build
```

## 📂 專案結構

- `src/App.vue`: 主要應用程式進入點與頁面結構。
- `src/style.css`: 全域樣式變數與設計系統定義。
- `src/main.js`: 應用程式掛載點。

## 📦 部署 (GitHub Pages)

本專案已設定自動化部署腳本。

### 部署步驟

1. 確保所有變更已 commit。
2. 執行部署指令：
   ```bash
   npm run deploy
   ```
   此指令會自動執行 `npm run build` 並將 `dist` 資料夾內容推送至遠端倉庫的 `gh-pages` 分支。
3. 前往 GitHub Repository 的 **Settings > Pages**，確認 Source 設定為 `gh-pages` branch。

> **注意**：若是部署到 Project Site (如 `username.github.io/repo-name`)，請確認 `vite.config.js` 中的 `base` 設定正確。若是部署到 User Site (`username.github.io`)，`base` 應保留為 `/`。

---
&copy; 2026 MyResume. Built with Vue.js.

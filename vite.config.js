import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 設定為相對路徑，這樣部署到任何子目錄都能運作
  plugins: [vue()],
})

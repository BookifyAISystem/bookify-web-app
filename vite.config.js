import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // 🟢 Cố định cổng 5174 cho React app
    proxy: {
      '/api': {
        target: 'https://localhost:7088',  // 🟢 Đúng URL của API
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,  // Giữ nguyên để tránh lỗi 404 khi reload
  },
});

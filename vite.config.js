import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mrg-mashan/',
  server: {
    open: true, // זה יפתח אוטומטית את האתר בדפדפן כרום שלך בהרצה
  }
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, forward /api calls to Spring Boot so the browser sees one origin (no CORS).
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8085' } },
});

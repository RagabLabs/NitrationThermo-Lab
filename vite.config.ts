import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/NitrationThermo-Lab/', build: { chunkSizeWarningLimit: 900 }, test: { include: ['tests/**/*.test.ts'] } });

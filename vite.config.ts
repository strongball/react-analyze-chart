import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/react-analyze-chart',
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        threads: false,
    },
});

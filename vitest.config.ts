import react from '@vitejs/plugin-react';
import { defineConfig, } from 'vitest/config';

export default defineConfig( {
	cacheDir: '.test-cache',
	plugins: [react(),],
	test: {
		coverage: {
			reportsDirectory: './coverage',
			all: false,
			include: [
				'src/*.ts',
				'src/internal/*.ts',
			],
			reporter: ['text', 'html', 'json-summary',],
		},
		environment: 'happy-dom',
		globals: true,
		mockReset: true,
		watch: false,
	},
}, );

import { defineConfig, } from 'vitest/config';

export default defineConfig( {
	cacheDir: '.test-cache',
	test: {
		coverage: {
			provider: 'v8', // Explicitly specify v8 provider
			reportsDirectory: './coverage',
			all: true,
			include: [
				'src/**/*.ts', // Update pattern to catch all TypeScript files in src
			],
			reporter: [
				'text',
				'html',
				'json-summary',
				'lcov', // Add lcov for better IDE integration
			],
		},
		environment: 'happy-dom',
		globals: true,
		mockReset: true,
		watch: false,
	},
}, );

import process from 'node:process';
import bundleAnalyzer from '@next/bundle-analyzer';
import pkg from './package.json' with { type: 'json',};
import createMDX from '@next/mdx';

const withBundleAnalyzer = bundleAnalyzer( {
	enabled: process.env.ANALYZE === 'true',
}, );

/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		optimizePackageImports: [
			'lucide-react',
		],
	},
	transpilePackages: [
		'lucide-react',
	],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'github.com',
			},
			{
				protocol: 'https',
				hostname: 'img.shields.io',
			},
		],
		dangerouslyAllowSVG: true,
	},
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ['md', 'mdx', 'ts', 'tsx',],
};

if ( process.env.NODE_ENV === 'production' ) {
	nextConfig.basePath = `/${pkg.name}`;
	nextConfig.output = 'export';
	nextConfig.images = {
		unoptimized: true,
	};
}

const withMDX = createMDX( {
	extension: /\.md(x)?$/,
}, );

export default withBundleAnalyzer( withMDX( nextConfig, ), );

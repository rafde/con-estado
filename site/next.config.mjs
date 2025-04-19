import process from 'node:process';
import bundleAnalyzer from '@next/bundle-analyzer';
import pkg from '../package.json' with { type: 'json',};
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withBundleAnalyzer = bundleAnalyzer( {
	enabled: process.env.ANALYZE === 'true',
}, );

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
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
		'next-mdx-remote',
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
			{
				protocol: 'https',
				hostname: 'badgen.net',
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
	extension: /\.md$/,
	// Add markdown plugins here, as desired
	options: {
		format: 'mdx',
		remarkPlugins: [remarkGfm,],
		rehypePlugins: [
		],
	},
}, );

export default withBundleAnalyzer( withMDX( nextConfig, ), );

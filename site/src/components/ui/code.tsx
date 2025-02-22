import type { CSSProperties, PropsWithChildren, } from 'react';
import { type SyntaxHighlighterProps, Prism as SyntaxHighlighter, } from 'react-syntax-highlighter';
import { vscDarkPlus, } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customStyleDefault = {
	margin: 0,
	padding: 0,
	fontSize: 'inherit',
	lineHeight: 'inherit',
};

type CodeProps = {
	lang?: string
} & Omit<SyntaxHighlighterProps, 'language' | 'PreTag' | 'CodeTag'>;

function CodeTag( props: PropsWithChildren<{
	className: string
	style: CSSProperties
}>, ) {
	const {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		style,
		..._props
	} = props;
	return <code {...{
		..._props,
		className: `${props.className} whitespace-pre-wrap text-[#9cdcfe] [font-size:inherit] [line-height:inherit] hyphens-none overflow-hidden bg-[#1e1e1e] p-1 rounded-sm break-words`,
	}} />;
}
function PreTag( props: PropsWithChildren<{
	className: string
	style: CSSProperties
}>, ) {
	return <>{props.children}</>;
}

export default function Code( props: CodeProps, ) {
	const {
		lang = 'typescript',
	} = props;
	return <SyntaxHighlighter style={vscDarkPlus} customStyle={customStyleDefault} PreTag={PreTag} CodeTag={CodeTag} language={lang}>
		{props.children}
	</SyntaxHighlighter>;
}

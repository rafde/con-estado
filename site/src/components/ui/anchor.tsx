type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	'aria-label': string
};

export default function Anchor( props: AnchorProps, ) {
	const {
		className = '',
		href,
		children,
	} = props;

	return <a {...props} href={href} className={`underline ${className}`}>{children}</a>;
}

'use client';
import { useCallback, useState, } from 'react';
import { CopyIcon, CopyCheck, } from 'lucide-react';

type CodeBlockCopyButtonProps = {
	code: string
};

export default function CodeBlockCopyButton( props: CodeBlockCopyButtonProps, ) {
	const [copied, setCopied,] = useState( false, );
	const onClick = useCallback(
		async() => {
			await navigator.clipboard.writeText( props.code.trim(), );
			setCopied( true, );
			setTimeout( () => setCopied( false, ), 2000, );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return <button
		className="absolute right-2 top-2 text-white cursor-pointer"
		aria-label={`Copying text: ${props.code}`}
		type="button"
		onClick={onClick}
	>
		{copied ? <CopyCheck className="size-4 text-green-500" /> : <CopyIcon className="size-4" />}
	</button>;
}

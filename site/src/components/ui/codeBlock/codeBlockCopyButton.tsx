'use client';
import { useCallback, useState, } from 'react';
import { CopyToClipboard, } from 'react-copy-to-clipboard';
import { CopyIcon, CopyCheck, } from 'lucide-react';

type CodeBlockCopyButtonProps = {
	code: string
};

export default function CodeBlockCopyButton( props: CodeBlockCopyButtonProps, ) {
	const [copied, setCopied,] = useState( false, );
	const onCopy = useCallback( () => {
		setCopied( true, );
		setTimeout( () => setCopied( false, ), 2000, );
	}, [], );

	return <CopyToClipboard text={props.code} onCopy={onCopy}>
		<button
			className="absolute right-2 top-2 text-white"
			aria-label={`Copying text: ${props.code}`}
			type="button"
		>
			{copied ? <CopyCheck className="size-4 text-green-500" /> : <CopyIcon className="size-4" />}
		</button>
	</CopyToClipboard>;
}

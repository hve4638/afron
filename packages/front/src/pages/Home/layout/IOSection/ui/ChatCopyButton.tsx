import { useEffect, useState } from 'react';
import { GIconButton } from '@/components/GoogleFontIcon';
import { useEvent } from '@/hooks/useEvent';

function ChatCopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            window.setTimeout(
                () => setCopied(false),
                500
            );
        }
    }, [copied])

    return (
        <GIconButton
            hoverEffect='square'
            value={
                copied ? 'check' : 'content_copy'
            }
            onClick={(e) => {
                e.stopPropagation();

                setCopied(true);
                navigator.clipboard.writeText(text);
            }}
        />
    )
}

export default ChatCopyButton;
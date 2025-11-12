import { useState } from 'react';

import { emitEvent, useEvent } from '@/hooks/useEvent';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';

function CopyButton() {
    const [copySuccessed, setCopySuccessed] = useState(false);

    useEvent('after_copy_response', () => {
        setCopySuccessed(true);
        setTimeout(() => setCopySuccessed(false), 500);
    }, []);
    
    return <GIconButton
        style={{
            fontSize: '1.15em'
        }}
        value={
            copySuccessed ? 'check' : 'content_copy'
        }
        hoverEffect='square'
        onClick={() => {
            emitEvent('copy_response');
        }}
    />
}

export default CopyButton;
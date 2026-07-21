import { useState } from 'react';

import { requestBus } from '@/events/request';
import { useOn } from '@/lib/zustbus';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';

function CopyButton() {
    const [copySuccessed, setCopySuccessed] = useState(false);

    useOn(requestBus.on.after_copy_response, () => {
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
            requestBus.emit.copy_response();
        }}
    />
}

export default CopyButton;
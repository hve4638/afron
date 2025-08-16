import { useEvent } from '@/hooks/useEvent';
import { useProfileAPIStore, useSessionStore } from '@/stores';
import { encodingForModel } from 'js-tiktoken';
import { useMemo } from 'react';

interface useTokenCounterProps {
    inputRef: React.RefObject<string>;
}

function useTokenCounter({ inputRef }: useTokenCounterProps) {
    const updateSession = useSessionStore(state=>state.update);

    const tokenizer = useMemo(() => {
        return encodingForModel('chatgpt-4o-latest');
    }, []);

    useEvent('update_input_token_count', () => {
        const count = tokenizer.encode(inputRef.current ?? '').length
        updateSession.input_token_count(count);
    }, [tokenizer, inputRef]);
}

export default useTokenCounter;
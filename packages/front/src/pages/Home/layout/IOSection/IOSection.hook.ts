import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getEncoding, encodingForModel } from 'js-tiktoken';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import useTrigger from '@/hooks/useTrigger';

import { useSessionStore, useChannelStore, useProfileAPIStore } from '@/stores';
import { emitEvent, useEvent } from '@/hooks/useEvent';

function useIOSection() {
    const sessionState = useSessionStore();
    const color = useSessionStore(state => state.color);
    const { api } = useProfileAPIStore();

    const [inputLayoutType, setInputLayoutType] = useState<'normal' | 'chat'>('normal');
    const [tokenCount, setTokenCount] = useState(0);
    const inputTextRef = useRef('');
    const [_, refresh] = useTrigger();
    const [reloadInputSignal, triggerReloadInput] = useTrigger();

    useEvent('refresh_input', () => triggerReloadInput(), []);

    const tokenizer = useMemo(() => {
        return encodingForModel('chatgpt-4o-latest');
    }, []);

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const updateInputTextThrottle = useLazyThrottle(() => {
        sessionState.update.input(inputTextRef.current);
    }, 100);

    const updateInputText = (text: string) => {
        inputTextRef.current = text;
        setTokenCount(tokenizer.encode(text).length);
        updateInputTextThrottle();
        refresh();
    }

    useEffect(() => {
        setTokenCount(tokenizer.encode(inputTextRef.current).length);
        updateInputTextThrottle();
        refresh();
    }, [sessionState.deps.last_session_id])

    useEffect(() => {
        api.rt(sessionState.rt_id).getMetadata()
            .then(({ input_type }) => {
                setInputLayoutType(input_type);
            });
    }, [api, sessionState.rt_id])

    useEffect(() => {
        if (sessionState.state === 'done') {
            sessionState.update.state('idle');
            emitEvent('refresh_session_metadata');
        }
    }, [sessionState.deps.last_session_id, sessionState.state]);

    useLayoutEffect(() => {
        inputTextRef.current = sessionState.input;
        refresh();
    }, [sessionState.deps.last_session_id, reloadInputSignal]);

    useEvent('request', async () => {
        const { instance } = useChannelStore.getState();

        await sessionState.update.input(inputTextRef.current);
        await instance.request_ready.produce(1);
    }, []);
    useEvent('send_request', () => {
        const { state } = useSessionStore.getState();

        if (state === 'idle' || state === 'done') {
            sessionState.actions.request();
        }
        else {
            console.warn('request is ignored, because current state is', state);
        }
    }, []);
    useEvent('copy_response', () => {
        const output = useSessionStore.getState().output;
        if (output) {
            try {
                console.log('copying response to clipboard', output);
                navigator.clipboard.writeText(output);
                emitEvent('after_copy_response');
            }
            catch (error) {
                console.error('Failed to copy response:', error);
            }
        }
    }, []);

    return {
        inputLayoutType,
        color,
        tokenCount,
        inputTextRef,
        updateInputText,
    }
}

export default useIOSection;
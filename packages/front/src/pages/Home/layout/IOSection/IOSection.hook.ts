import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getEncoding, encodingForModel } from 'js-tiktoken';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import useTrigger from '@/hooks/useTrigger';

import { useSessionStore, useProfileAPIStore } from '@/stores';
import { emitEvent, useEvent, useEventState } from '@/hooks/useEvent';
import useFileUploadHandler from './hooks/useFileUploadHandler';
import useTokenCounter from './hooks/useTokenCounter';

function useIOSection() {
    const sessionState = useSessionStore();
    const color = useSessionStore(state => state.color);
    const { api } = useProfileAPIStore();

    const [inputLayoutType, setInputLayoutType] = useState<'normal' | 'chat'>('normal');
    const [tokenCount, setTokenCount] = useState(0);
    const inputTextRef = useRef('');
    const [_, refresh] = useTrigger();
    
    useFileUploadHandler();
    useTokenCounter({ inputRef: inputTextRef });
    
    const refreshInputState = useEventState('refresh_input');

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const updateInputTextThrottle = useLazyThrottle(() => {
        sessionState.update.input(inputTextRef.current);
    }, 100);
    
    const updateInputText = (text: string) => {
        inputTextRef.current = text;
        emitEvent('update_input_token_count');
        updateInputTextThrottle();
        refresh();
    }

    useEffect(() => {
        emitEvent('update_input_token_count');
        updateInputTextThrottle();
        refresh();
    }, [sessionState.deps.last_session_id]);

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
    }, [sessionState.deps.last_session_id, refreshInputState]);

    // 요청 시 입력값을 즉시 업데이트
    useEvent('request_ready', async (chan) => {
        await sessionState.update.input(inputTextRef.current);
        chan.produce(0); // 완료 신호
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
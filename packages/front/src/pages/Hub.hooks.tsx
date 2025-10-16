import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNavigateEvent } from '@/events/navigate';

export function HubEventHandler() {
    const navigate = useNavigate();
    const [navigateStack, setNavigateStack] = useState<string[]>([]);

    useNavigateEvent('goto_workflow_editor', ({ rtId }) => {
        const navigateTo = `/workflow/${rtId}`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);
    useNavigateEvent('goto_prompt_editor', ({ rtId, promptId }) => {
        const navigateTo = `/workflow/${rtId}/prompt/${promptId}`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);
    useNavigateEvent('goto_test', () => {
        const navigateTo = `/test`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);

    useNavigateEvent('goto_home', () => {
        setNavigateStack([]);
        navigate('/');
    });
    useNavigateEvent('back', () => {
        const navigateTo = navigateStack.at(-2) ?? '/';
        setNavigateStack(prev => prev.slice(0, -1));

        navigate(navigateTo);
    });

    return <></>;
}
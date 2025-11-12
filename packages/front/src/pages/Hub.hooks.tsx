import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNavigateOn } from '@/events/navigate';

export function HubEventHandler() {
    const navigate = useNavigate();
    const [navigateStack, setNavigateStack] = useState<string[]>([]);

    useNavigateOn('goto_workflow_editor', ({ rtId }) => {
        const navigateTo = `/workflow/${rtId}`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);
    useNavigateOn('goto_prompt_editor', ({ rtId, promptId }) => {
        const navigateTo = `/workflow/${rtId}/prompt/${promptId}`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);
    useNavigateOn('goto_test', () => {
        const navigateTo = `/test`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);

    useNavigateOn('goto_home', () => {
        setNavigateStack([]);
        navigate('/');
    });
    useNavigateOn('back', () => {
        const navigateTo = navigateStack.at(-2) ?? '/';
        setNavigateStack(prev => prev.slice(0, -1));

        navigate(navigateTo);
    });

    return <></>;
}
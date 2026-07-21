import { useState } from 'react';
import { useNavigate } from 'react-router';
import { navigateBus } from '@/events/navigate';
import { useOn } from '@/lib/zustbus';

export function HubEventHandler() {
    const navigate = useNavigate();
    const [navigateStack, setNavigateStack] = useState<string[]>([]);

    useOn(navigateBus.on.goto_workflow_editor, ({ rtId }) => {
        const navigateTo = `/workflow/${rtId}`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);
    useOn(navigateBus.on.goto_prompt_editor, ({ rtId, promptId }) => {
        const navigateTo = `/workflow/${rtId}/prompt/${promptId}`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);
    useOn(navigateBus.on.goto_test, () => {
        const navigateTo = `/test`;

        setNavigateStack((prev) => [...prev, navigateTo]);
        navigate(navigateTo);
    }, []);

    useOn(navigateBus.on.goto_home, () => {
        setNavigateStack([]);
        navigate('/');
    });
    useOn(navigateBus.on.back, () => {
        const navigateTo = navigateStack.at(-2) ?? '/';
        setNavigateStack(prev => prev.slice(0, -1));

        navigate(navigateTo);
    });

    return <></>;
}

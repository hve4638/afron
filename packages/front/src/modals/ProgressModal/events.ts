import { createBus, Ping } from '@/lib/zustbus';

const [
    _,
    emitProgressModalEvent,
    useProgressModalEvent
] = createBus<{
    title: { id: string; value: string | null; };
    description: { id: string; value: string | null; };
    close: { id: string; };
}>();

export {
    useProgressModalEvent,
    emitProgressModalEvent
};

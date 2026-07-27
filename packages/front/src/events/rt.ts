import { createBus, Ping } from '@/lib/zustbus';

interface RTEvent {
    import_rt_from_file: Ping;
    export_rt_to_file: { rtId: string; };
}

export const rtBus = createBus<RTEvent>();

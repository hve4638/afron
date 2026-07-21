import { createBus, Ping } from '@/lib/zustbus';

interface TabEvent {
    create_tab: Ping;
    remove_tab: Ping;
    undo_remove_tab: Ping;
    next_tab: Ping;
    prev_tab: Ping;
    change_tab1: Ping;
    change_tab2: Ping;
    change_tab3: Ping;
    change_tab4: Ping;
    change_tab5: Ping;
    change_tab6: Ping;
    change_tab7: Ping;
    change_tab8: Ping;
    change_tab9: Ping;
}

export const tabBus = createBus<TabEvent>();

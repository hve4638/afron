import { useEffect } from 'react';

import { appBus } from '@/events/app';
import { navigateBus } from '@/events/navigate';
import { requestBus } from '@/events/request';
import { tabBus } from '@/events/tab';
import useShortcutStore from '@/stores/useShortcutStore';

import useHotkey from '@/hooks/useHotkey';

import { Shortcut } from '@/types/shortcut';
import { useKeyBind } from '@/hooks/useKeyBind';
import { useModal } from '@/features/modal';

function useShortcutEmitter() {
    const shortcuts = useShortcutStore();

    useShortcut(shortcuts.font_size_up, appBus.emit.font_size_up);
    useShortcut(shortcuts.font_size_down, appBus.emit.font_size_down);
    useShortcut(shortcuts.send_request, requestBus.emit.send_request);
    useShortcut(shortcuts.copy_response, requestBus.emit.copy_response);
    useShortcut(shortcuts.create_tab, tabBus.emit.create_tab);
    useShortcut(shortcuts.remove_tab, tabBus.emit.remove_tab);
    useShortcut(shortcuts.undo_remove_tab, tabBus.emit.undo_remove_tab);
    useShortcut(shortcuts.next_tab, tabBus.emit.next_tab);
    useShortcut(shortcuts.prev_tab, tabBus.emit.prev_tab);
    useShortcut(shortcuts.tab1, tabBus.emit.change_tab1);
    useShortcut(shortcuts.tab2, tabBus.emit.change_tab2);
    useShortcut(shortcuts.tab3, tabBus.emit.change_tab3);
    useShortcut(shortcuts.tab4, tabBus.emit.change_tab4);
    useShortcut(shortcuts.tab5, tabBus.emit.change_tab5);
    useShortcut(shortcuts.tab6, tabBus.emit.change_tab6);
    useShortcut(shortcuts.tab7, tabBus.emit.change_tab7);
    useShortcut(shortcuts.tab8, tabBus.emit.change_tab8);
    useShortcut(shortcuts.tab9, tabBus.emit.change_tab9);

    useKeyBind({
        'C-A-F12': (e) => navigateBus.emit.goto_test(),
    }, [], import.meta.env['VITE_DEV'] === 'TRUE');
}

function useShortcut(shortcut: Shortcut, callback: () => void) {
    const { count: modalCount } = useModal();

    const addHandler = (shortcut: Shortcut, callback: () => void, verbose: boolean = false, name: string = 'shortcut') => {
        if (shortcut == null) return () => { };
        if (shortcut.key) {
            const handler = (e: KeyboardEvent) => {
                if (
                    e.isComposing === false // 한글 입력 중 두 번 이벤트 발생하는 경우 처리
                    && e.ctrlKey === (shortcut.ctrl ?? false)
                    && e.shiftKey === (shortcut.shift ?? false)
                    && e.altKey === (shortcut.alt ?? false)
                    && e.code === shortcut.key
                ) {
                    callback();
                }
            }

            window.addEventListener('keydown', handler);
            return () => {
                window.removeEventListener('keydown', handler);
            }
        }
        else if (shortcut.wheel) {
            const handler = (e: WheelEvent) => {
                if (
                    e.ctrlKey === (shortcut.ctrl ?? false)
                    && e.shiftKey === (shortcut.shift ?? false)
                    && e.altKey === (shortcut.alt ?? false)
                    && Math.sign(e.deltaY) === shortcut.wheel
                ) {
                    callback();
                }
            }

            window.addEventListener('wheel', handler);
            return () => {
                window.removeEventListener('wheel', handler);
            }
        }
        else {
            return () => { };
        }
    };

    useEffect(() => {
        if (modalCount > 0) return;
        const removeHandler = addHandler(shortcut, callback);

        return removeHandler;
    }, [shortcut, modalCount]);
}

export default useShortcutEmitter;
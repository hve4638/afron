import { useEffect } from 'react';
import { Shortcut } from '@/types/shortcut';
import useShortcutStore from '@/stores/useShortcutStore';
import { emitEvent, EventNames } from '@/hooks/useEvent';

function useShortcutEmitter() {
    const shortcuts = useShortcutStore();

    useShortcut(shortcuts.font_size_up, 'font_size_up');
    useShortcut(shortcuts.font_size_down, 'font_size_down');
    useShortcut(shortcuts.send_request, 'send_request');
    useShortcut(shortcuts.copy_response, 'copy_response');
    useShortcut(shortcuts.create_tab, 'create_tab');
    useShortcut(shortcuts.remove_tab, 'remove_tab');
    useShortcut(shortcuts.undo_remove_tab, 'undo_remove_tab');
    useShortcut(shortcuts.next_tab, 'next_tab');
    useShortcut(shortcuts.prev_tab, 'prev_tab');
    useShortcut(shortcuts.tab1, 'change_tab1');
    useShortcut(shortcuts.tab2, 'change_tab2');
    useShortcut(shortcuts.tab3, 'change_tab3');
    useShortcut(shortcuts.tab4, 'change_tab4');
    useShortcut(shortcuts.tab5, 'change_tab5');
    useShortcut(shortcuts.tab6, 'change_tab6');
    useShortcut(shortcuts.tab7, 'change_tab7');
    useShortcut(shortcuts.tab8, 'change_tab8');
    useShortcut(shortcuts.tab9, 'change_tab9');
}

function useShortcut(shortcut: Shortcut, eventName: EventNames) {
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

    useEffect(
        () => addHandler(shortcut, () => emitEvent(eventName, undefined)),
        [shortcut]
    );
}

export default useShortcutEmitter;
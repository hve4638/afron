import useHotkey from '@/hooks/useHotkey';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Shortcut } from 'types/shortcut';
import { getKeyType, isKeyCodeChar, KEY_TYPE, mapKeyCode } from 'utils/keycode-map';
import { shortcutToText } from 'utils/shortcut';

const hasSpecialKey = (shortcut: Shortcut) => {
    return shortcut.ctrl || shortcut.shift || shortcut.alt || shortcut.win;
}

type ShortcutModalProps = {
    initValue?: Shortcut;
    name: string;
    onChange?: (shortcut: Shortcut) => void;
    onClose?: () => void;
}

function useShortcutModal({
    initValue = {},
    name,
    onChange = () => { },
    onClose = () => { },
}: ShortcutModalProps) {
    const [focus, setFocus] = useState(false);
    const [shortcut, setShortcut] = useState<Shortcut>(initValue);
    const shortcutText = useMemo(() => shortcutToText(shortcut), [shortcut]);
    const validShortcut = useMemo(() => {
        if (shortcut.click) return true;
        if (shortcut.wheel) return hasSpecialKey(shortcut);
        if (shortcut.key) {
            const keyCode = shortcut.key;
            const keyType = getKeyType(keyCode);

            switch (keyType) {
                case KEY_TYPE.FUNCTION:
                    return true;
                case KEY_TYPE.ARROW:
                case KEY_TYPE.NUMBER:
                    return hasSpecialKey(shortcut);
                case KEY_TYPE.CONTROL:
                    // Tab, Enter, Space, Escape, CapsLock, Backspace
                    switch (keyCode) {
                        case 'Tab':
                        case 'Backspace':
                            return true;
                        default:
                            return hasSpecialKey(shortcut);
                    }
                case KEY_TYPE.SYSTEM:
                    // Pause, ScrollLock, PageUp, PageDown 등
                    switch (keyCode) {
                        case 'Insert':
                        case 'Pause':
                        case 'ScrollLock':
                        case 'PageUp':
                        case 'PageDown':
                            return true;
                        default:
                            return hasSpecialKey(shortcut);
                    }
                default:
                    return hasSpecialKey(shortcut);
            }
        }
        return false;
    }, [shortcut]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key === 'Control') return;
        if (e.key === 'Shift') return;
        if (e.key === 'Meta') return;
        if (e.key === 'Alt') return;

        const newShortcut: Shortcut = {
            key: e.code,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            win: e.metaKey,
        }
        setShortcut(newShortcut);
    }
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.deltaY === 0) return;
        const newShortcut: Shortcut = {
            wheel: Math.sign(e.deltaY) as (1 | -1),
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            win: e.metaKey,
        }
        setShortcut(newShortcut);
    }
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button >= 3) {
            e.preventDefault();
            e.stopPropagation();
            console.log(e.button);

            const newShortcut: Shortcut = {
                click: e.button as (3 | 4),
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                win: e.metaKey,
            }
            setShortcut(newShortcut);
        }
    }

    useHotkey({
        'Escape': () => {
            onClose();
            return true;
        }
    }, true, [onClose]);

    useEffect(() => {
        if (!focus) return;
        addEventListener('wheel', handleWheel);
        addEventListener('mousedown', handleMouseDown);

        return () => {
            removeEventListener('wheel', handleWheel);
            removeEventListener('mousedown', handleMouseDown);
        }
    }, [focus]);
}

export default useShortcutModal;
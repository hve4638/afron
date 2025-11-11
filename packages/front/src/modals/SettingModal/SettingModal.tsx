import { useEffect, useState } from 'react';
import { Modal, ModalHeader } from '@/components/modal';
import {
    GeneralOptions,
    APIKeyOptions,
    HistoryOptions,
    ServerOptions,
    DataOptions,
    ModelOptions,
    ShortcutOptions,
} from './options';
import { MODAL_DISAPPEAR_DURATION_MS } from '@/constants';
import useHotkey from 'hooks/useHotkey';
import useModalDisappear from 'hooks/useModalDisappear';
import { Column, Flex } from '@/components/layout';
import useMemoryStore from '@/stores/useMemoryStore';
import AdvancedOptions from './options/AdvancedOptions';

const SETTING_CATEGORY = {
    GENERAL: '일반',
    API: 'API 키',
    MODELS: '모델',
    SHORTCUT: '단축키',
    SESSION: '세션',
    HISTORY: '기록',
    SERVER: '서버 (베타)',
    DATA: '데이터',
    ADVANCED: '고급',
}
type SETTING_CATEGORY = typeof SETTING_CATEGORY[keyof typeof SETTING_CATEGORY];


type SettingModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function SettingModal({
    isFocused,
    onClose,
}: SettingModalProps) {
    const categories = [
        SETTING_CATEGORY.GENERAL,
        SETTING_CATEGORY.MODELS,
        SETTING_CATEGORY.API,
        SETTING_CATEGORY.SHORTCUT,
        // SETTING_CATEGORY.HISTORY,
        // SETTING_CATEGORY.SERVER,
        // SETTING_CATEGORY.DATA,
        SETTING_CATEGORY.ADVANCED,
    ]
    const [disappear, close] = useModalDisappear(onClose);
    const [currentCategory, setCurrentCategory] = useState<SETTING_CATEGORY>(SETTING_CATEGORY.GENERAL);
    const version = useMemoryStore(state => state.version);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                height: '80%',
                maxHeight: '80%',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateRows: '48px 1fr',
                    gridTemplateColumns: '96px 1fr',
                    width: '100%',
                    height: '100%',
                }}
            >
                <div>
                </div>
                <div>
                    <ModalHeader onClose={close}>{currentCategory}</ModalHeader>
                </div>
                <Column
                    className='undraggable'
                    style={{
                        fontSize: '0.9em',
                    }}
                >
                    {
                        categories.map((category, index) => (
                            <div
                                className={
                                    'setting-category' +
                                    (currentCategory === category ? ' selected' : '')
                                }
                                key={index}
                                style={{
                                    width: '100%',
                                    margin: '0px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    setCurrentCategory(category);
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '0.95em',
                                    }}
                                >
                                    {category}
                                </span>
                            </div>
                        ))
                    }
                    <Flex/>
                    <small className='subtle-text'>{version}</small>
                </Column>
                <div
                    style={{
                        display: 'block',
                        overflowY: 'auto',
                        padding: '0px 8px',
                    }}
                >
                    {
                        currentCategory === SETTING_CATEGORY.GENERAL &&
                        <GeneralOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.MODELS &&
                        <ModelOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.API &&
                        <APIKeyOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.SHORTCUT &&
                        <ShortcutOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.HISTORY &&
                        <HistoryOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.SERVER &&
                        <ServerOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.DATA &&
                        <DataOptions />
                    }
                    {
                        currentCategory === SETTING_CATEGORY.ADVANCED &&
                        <AdvancedOptions />
                    }
                </div>
            </div>
        </Modal>
    )
}

export default SettingModal;
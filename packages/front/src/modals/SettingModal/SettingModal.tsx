import { useState } from 'react';
import { Modal, ModalHeader, useModalInstance } from '@/features/modal';
import { Column, Flex } from '@/components/layout';
import useMemoryStore from '@/stores/useMemoryStore';
import {
    GeneralOptions,
    APIKeyOptions,
    HistoryOptions,
    ServerOptions,
    DataOptions,
    ModelOptions,
    ShortcutOptions,
    AdvancedOptions,
} from './options';
import { SETTING_CATEGORY } from './constants';

function SettingModal() {
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
    const [currentCategory, setCurrentCategory] = useState<SETTING_CATEGORY>(SETTING_CATEGORY.GENERAL);
    const version = useMemoryStore(state => state.version);
    const { closeModal } = useModalInstance();

    return (
        <Modal
            style={{
                height: '80%',
                maxHeight: '80%',
            }}
            allowEscapeKey={true}
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
                <div></div>
                <div>
                    <ModalHeader
                        onClose={closeModal}
                        showCloseButton={true}
                    >{currentCategory}</ModalHeader>
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
                    <Flex />
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
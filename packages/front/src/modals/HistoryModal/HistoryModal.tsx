import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Align, Column, Flex, Gap, Grid, Row } from '@/components/layout';
import { useCacheStore, useSessionStore } from '@/stores';
import { useHistoryStore } from '@/stores/useHistoryStore';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import { emitEvent } from '@/hooks/useEvent';
import useTrigger from '@/hooks/useTrigger';

import { Modal, ModalHeader } from '@/features/modal';
import { useModalInstance } from '@/features/modal';
import { HistoryData } from '@/features/session-history';

import HistoryItem from './HistoryItem';

import styles from './styles.module.scss';

function HistoryModal() {
    const { t } = useTranslation();
    const { closeModal } = useModalInstance();
    const historyState = useHistoryStore();
    const updateSessionState = useSessionStore(state=>state.update);
    const [refreshHistoryPing, refreshHistory] = useTrigger();
    const {
        last_session_id,

        history_search_scope,
        history_apply_rt,
        history_apply_model,
        history_apply_form,
        update : updateCacheState,
    } = useCacheStore();
    const [searchTextInstant, setSearchTextInstant] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    const setSearchTextThrottle = useLazyThrottle(()=>{
        setSearchText(searchTextInstant);
    }, 250)

    const [history, setHistory] = useState<HistoryData[]>([]);
    
    useEffect(()=>{
        if (!last_session_id) return;
        
        const historyCache = historyState.get(last_session_id);
        if (searchText.length === 0) {
            historyCache.select(0, 100, true)
                .then((result) => {
                    setHistory(result);  
                });
        }
        else {
            historyCache.search(0, 100, { text : searchText, searchScope : history_search_scope })
                .then((result) => {
                    setHistory(result);
                });
        }
    }, [last_session_id, searchText, history_search_scope, refreshHistoryPing])

    return (
        <Modal
            style={{
                minWidth: '80%',
                height: '80%',
                // paddingTop: '0.5em'
            }}
            allowEscapeKey={true}
            header={{
                label: t('history.title'),
                showCloseButton: true,
            }}
        >
            <Grid
                className={styles['history-container']}
                columns='1fr'
                rows='0.5em 1.5em 0.75em 1fr 1.5em'
                // rows='2.5em 0.5em 1.5em 0.75em 1fr 1.5em'
                style={{
                    height: '100%',
                }}
            >
                {/* <ModalHeader onClose={closeModal}>
                    {t('history.title')}
                </ModalHeader>
                <div/> */}
                <Gap/>
                <Row
                    style={{
                        gap: '0.5em',
                    }}
                >
                    <Flex/>
                    <select
                        value={history_search_scope}
                        onChange={(e)=>{
                            updateCacheState.history_search_scope(e.target.value as 'any'|'input'|'output');
                        }}
                    >
                        <option value='any'>입력 + 출력</option>
                        <option value='input'>입력</option>
                        <option value='output'>출력</option>
                    </select>
                    <input
                        className={classNames(styles['search-input'])}
                        type='text'
                        onChange={(e)=>{
                            setSearchTextInstant(e.target.value);
                            setSearchTextThrottle();
                        }}
                    />
                </Row>
                <div/>
                <Column
                    className={classNames(styles['history-list'], 'undraggable')}
                    style={{
                        width: '100%',
                        maxHeight: '100%',
                        height: '100%',
                        overflowY: 'auto',
                    }}
                >
                    {
                        history.map((item, index) => (
                            <HistoryItem
                                key={`${item.id}_${index}`}
                                value={item}
                                onClick={async ()=>{
                                    const promises:Promise<void>[] = [];
                                    promises.push(updateSessionState.input(item.input ?? ''));
                                    promises.push(updateSessionState.output(item.output ?? ''));
                                    if (history_apply_rt) {
                                        promises.push(updateSessionState.rt_id(item.rtId));
                                    }
                                    if (history_apply_model) {
                                        promises.push(updateSessionState.model_id(item.modelId));
                                    }
                                    await Promise.all(promises);

                                    emitEvent('refresh_input');
                                    closeModal();
                                }}
                                onDelete={async ()=>{
                                    await historyState.actions.deleteMessage(item.id, 'both');
                                    refreshHistory();
                                }}
                            />
                        ))
                    }
                </Column>
                <Row
                    style={{
                        boxSizing : 'border-box',
                        padding : '0.5em 0em 0em 0em',
                        height : '100%',
                        gap : '1em',
                    }}
                    columnAlign={Align.Center}
                >
                    <LabeledCheckbox
                        checked={history_apply_model}
                        onChange={()=>{
                            updateCacheState.history_apply_model(!history_apply_model);
                        }}
                    >모델 복사</LabeledCheckbox>
                    <LabeledCheckbox
                        checked={history_apply_rt}
                        onChange={()=>{
                            updateCacheState.history_apply_rt(!history_apply_rt);
                        }}
                    >요청 템플릿 복사</LabeledCheckbox>
                    <LabeledCheckbox
                        checked={history_apply_form}
                        onChange={()=>{
                            updateCacheState.history_apply_form(!history_apply_form);
                        }}
                    >변수 복사</LabeledCheckbox>
                </Row>
            </Grid>
        </Modal>
    )
}

type LabeledCheckboxProps= {
    checked : boolean,
    onChange : () => void,
    children? : React.ReactNode,
}

function LabeledCheckbox({
    checked,
    onChange,
    children=<></>
}:LabeledCheckboxProps) {
    return (
        <Row
            style={{
                height : '100%',
                justifyContent : 'center',
                gap : '0.1em',
            }}
            columnAlign={Align.Center}
        >
            <span>{children}</span>
            <input
                type='checkbox'
                checked={checked}
                onChange={onChange}
                style={{
                    height : '100%',
                    aspectRatio : '1/1',
                }}
            />
        </Row>
    )
}

export default HistoryModal;
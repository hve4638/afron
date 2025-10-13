import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import { StringLongForm } from '@/components/forms';
import { Align, Column, Grid, Row } from '@/components/layout';
import ProfileEvent from '@/features/profile-event';
import { POTemplateList } from './POTemplateList';
import { FlowTemplateList } from './FlowTemplateList';
import { RTMode } from '@afron/types';

type Metadata = {
    name: string;
    id: string;
    templateId: string;
}

type EditMetadataStepProps = {
    rtMode: RTMode;
    onPrev: () => void;
    onConfirm: (metadata: Metadata) => void;
}

export function EditMetadataStep({
    rtMode,
    onPrev,
    onConfirm
}: EditMetadataStepProps) {
    const { t } = useTranslation();
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [templateId, setTemplateId] = useState<string>('empty');

    const [idValid, setIdValid] = useState<boolean>(false);

    useEffect(() => {
        ProfileEvent.rt.generateId()
            .then((nextId) => {
                setId(nextId);
            });
    }, []);

    useEffect(() => {
        if (id === '') {
            setIdValid(false);
        }
        else {
            isIdValid()
                .then(isValid => {
                    setIdValid(isValid);
                });
        }
    }, [id]);

    const isIdValid = async () => {
        if (id === '') {
            return false;
        }
        const exist = await ProfileEvent.rt.exists(id);
        return !exist;
    }

    return (
        <Column
            style={{
                minWidth: '650px',
                gap: '8px',
            }}
        >
            <Grid
                style={{
                    width: '100%',
                    gap: '8px',
                }}
                columns='11em 1fr'
                rows='1fr'

            >
                <Column>
                    <StringLongForm
                        name={t('rt.name')}
                        value={name}
                        onChange={(next) => setName(next)}
                        instantChange={true}
                    />
                    {/* <StringLongForm
                        name={t('rt.identifier')}
                        value={id}
                        onChange={(next)=>setId(next)}
                    /> */}
                </Column>
                {
                    rtMode === 'prompt_only' &&
                    <POTemplateList
                        value={templateId}
                        onChange={(next) => setTemplateId(next)}
                    />
                }
                {
                    rtMode === 'flow' &&
                    <FlowTemplateList
                        value={templateId}
                        onChange={(next) => setTemplateId(next)}
                    />
                }
            </Grid>
            <Row
                className='wfill'
                rowAlign={Align.End}
                style={{
                    height: '1.5em',
                }}
            >
                <Button
                    disabled={
                        name === '' || !idValid
                    }
                    style={{
                        width: '96px',
                        height: '100%'
                    }}
                    onClick={async () => {
                        if (name === '') return;
                        if (id === '') return;
                        if (await ProfileEvent.rt.exists(id)) {
                            return;
                        }

                        onConfirm({ name, id, templateId });
                    }}
                >{t('create_label')}</Button>
                <Button
                    className='transparent'
                    style={{
                        width: '96px',
                        marginLeft: '8px',
                    }}
                    onClick={onPrev}
                >{t('prev_label')}</Button>
            </Row>
        </Column>
    )
}
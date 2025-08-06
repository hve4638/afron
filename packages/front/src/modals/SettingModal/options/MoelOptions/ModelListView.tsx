import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Align, Flex, Row } from '@/components/layout';

import { useConfigStore } from '@/stores';
import useTrigger from '@/hooks/useTrigger';

import styles from './styles.module.scss';
import { GIconButton } from '@/components/GoogleFontIcon';
import ProfileEvent from '@/features/profile-event';

interface ModelListViewProps {
    modelCategory?: ChatAIModelCategory;
    onClick: (model: ChatAIModel) => Promise<void>;
}

function ModelListView({
    modelCategory,
    onClick,
}: ModelListViewProps) {
    const [categoryUnfold, setCategoryUnfold] = useState<boolean[]>([]);

    return (
        <div className={styles['model-list']}>
            {
                modelCategory != null &&
                modelCategory.groups.flatMap((g, index) => {
                    if (g.models == null) return <></>;
                    if (g.models.length === 0) return <></>;

                    return (<>
                        <GroupItem
                            key={g.groupName + index}
                            group={g}

                            onClick={async () => {
                                setCategoryUnfold((prev) => {
                                    const newUnfold = [...prev];
                                    newUnfold[index] = !newUnfold[index];
                                    return newUnfold;
                                });
                            }}
                        />
                        {
                            categoryUnfold[index] &&
                            g.models.map((model: ChatAIModel, index) => (
                                <ModelItem
                                    key={g.groupName + model.metadataId + index}
                                    model={model}
                                    onClick={async (model) => await onClick(model)}
                                />
                            ))
                        }
                    </>)
                })
            }
        </div>
    )
}

interface GroupItemProps {
    group: ChatAIModelGroup;
    onClick: (category: ChatAIModelGroup) => Promise<void>;
}

function GroupItem({ group, onClick }: GroupItemProps) {
    return (
        <Row
            className={
                classNames(styles['model-category'])
                // + (modelUnfold[index] ? ' unfold' : '')
            }
            onClick={async () => await onClick(group)}
            columnAlign={Align.Center}
        >
            <span>{group.groupName}</span>
            <Flex />
        </Row>
    )
}

interface ModelItemProps {
    model: ChatAIModel;
    onClick: (model: ChatAIModel) => Promise<void>;
}

function ModelItem({ model, onClick }: ModelItemProps) {
    const [_, refresh] = useTrigger();
    const flags = useMemo(() => model.flags, [model.flags])
    const starred = ProfileEvent.model.isStarred(model.modelId);
    const showActualName = useConfigStore(state => state.show_actual_model_name);

    return (
        <Row
            className={classNames(styles['model'], { [styles['starred']]: starred })}
            onDoubleClick={async (e) => {
                await onClick(model);
                refresh();
                e.stopPropagation();
            }}
            onRClick={(e) => {
                onClick(model);
                refresh();
                e.stopPropagation();
            }}
            columnAlign={Align.Center}
        >
            <Row
                style={{
                    flexWrap: 'wrap',
                }}
            >
                <span
                    className='noflex'
                >
                    {
                        showActualName
                            ? model.modelId
                            : model.displayName
                    }
                </span>
                {
                    flags.snapshot &&
                    <Tag>snapshot</Tag>
                }
                {
                    flags.deprecated &&
                    <Tag>deprecated</Tag>
                }
            </Row>
            <Flex />
            <GIconButton
                className={classNames(styles['star'], { [styles['starred']]: starred })}
                style={{
                    fontSize: '1.5em',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    marginRight: '4px',
                }}
                onClick={async (e) => {
                    await onClick(model);
                    refresh();
                    e.stopPropagation();
                }}
                value='star'
                hoverEffect='square'
            />
        </Row>
    )
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={styles['tag-container']}
            style={{
                display: 'flex',
                flexShrink: 1,
                flexBasis: 'auto',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
        >
            <span className={styles['tag']}>
                {children}
            </span>
        </div>
    )
}


export default ModelListView;
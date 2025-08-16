import { forwardRef, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Flex, Grid, Row } from '@/components/layout';
import { GIcon } from '@/components/GoogleFontIcon';

import { LogEntry } from '@/stores/useErrorLogStore';

import styles from './styles.module.scss';
import { formatRelative } from './utils';

interface LogEntryItemProps {
    entry: LogEntry;
    showDetailWhenRender?: boolean;
}

const LogEntryItem = forwardRef<HTMLDivElement, LogEntryItemProps>(
    ({
        entry,
        showDetailWhenRender = false
    }: LogEntryItemProps,
        ref
    ) => {
        const [showDetail, setShowDetail] = useState(showDetailWhenRender);
        const occured = useMemo(() => {
            if (entry.occurredAt.type === 'global') {
                return 'global';
            } else if (entry.occurredAt.type === 'session') {
                return `session (${entry.occurredAt.sessionId})`;
            } else {
                return 'unknown';
            }
        }, [entry.occurredAt]);
        const dateString = useMemo(() => {
            return formatRelative(entry.date);
        }, [entry.date])

        return (
            <Column
                ref={ref}
                className={classNames(styles['log-entry'])}
            >
                <Column
                    className='wfill'
                    onClick={() => setShowDetail(!showDetail)}
                >
                    <Row
                        className='undraggable'
                        style={{ gap: '0.25em', width: '100%' }}
                        columnAlign={Align.Center}
                    >
                        {
                            showDetail
                                ? <GIcon value='arrow_drop_down' />
                                : <GIcon value='arrow_right' />
                        }
                        <span>{entry.message}</span>
                        <Flex />
                        <small className='dimmed-color'>{dateString}</small>

                    </Row>
                    <span style={{ height: '0.15em' }} />
                    <small className='secondary-color' style={{ paddingLeft: '0.25em' }}>발생: {occured}</small>
                </Column>
                {
                    showDetail && entry.detail.length > 0 &&
                    <Column style={{ padding: '0.25em 1em', fontSize: '0.85em' }}>
                        {
                            entry.detail.map((detail, index) => (
                                <div key={index}>
                                    {detail}
                                </div>
                            ))
                        }
                    </Column>
                }
            </Column>
        )
    }
);

export default LogEntryItem;
import { GIconButton } from '@/components/GoogleFontIcon'
import { Align, Column } from '@/components/layout'
import classNames from 'classnames';

import styles from './SidePanel.module.scss';
import { SidePanelSections } from './types';

interface SidePanelProps {
    value: SidePanelSections | null;
    onChange: (value: SidePanelSections | null) => void;
}

const SidePanelIcon = {
    [SidePanelSections.File]: 'docs',
    [SidePanelSections.NodeLibrary]: 'network_node',
};

export function SidePanel({
    value,
    onChange
}: SidePanelProps) {
    return (
        <Column
            rowAlign={Align.Center}
        >
            <PanelButton
                value={SidePanelSections.File}
                onClick={onChange}
                currentlySelected={value}
            />
            <PanelButton
                value={SidePanelSections.NodeLibrary}
                onClick={onChange}
                currentlySelected={value}
            />
        </Column>
    );
}

interface PanelButtonProps {
    value: SidePanelSections;
    onClick: (value: SidePanelSections | null) => void;

    currentlySelected?: SidePanelSections | null;
}

export function PanelButton({ value, currentlySelected, onClick }: PanelButtonProps) {
    const enabled = currentlySelected === value;

    return (
        <div
            className={classNames(styles['panel-button'], {
                [styles['enabled']]: enabled,
            })}
            style={{
                width: '100%',
                aspectRatio: '1 / 1',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={() => {
                onClick(
                    value === currentlySelected ? null : value
                )
            }}
        >
            <GIconButton
                style={{ fontSize: '30px' }}
                value={SidePanelIcon[value]}
            />
            {
                enabled &&
                <div className={styles['line']} />
            }
        </div>
    );
}
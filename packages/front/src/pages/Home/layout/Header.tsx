import classNames from 'classnames';
import { Align, Flex, Grid, Row } from '@/components/layout';
import { useModal } from '@/hooks/useModal';
import { useSessionStore } from '@/stores';

import { AvatarButton, ErrorLogButton, FormButton, HistoryButton, ModelConfigButton } from './header-button';
import RTDropdown from './RTDropdown';
import ModelDropdown from './ModelDropdown';
import { Z_INDEX } from '@/constants/z-index';

function Header() {
    const color = useSessionStore(state => state.color);
    const colorStyle = `palette-${color}`;

    return (
        <header
            id='app-header'
            className={classNames(colorStyle)}
            style={{
                padding: '8px 8px 0px 8px',
                height: '40px',
                fontSize: '16px',
                zIndex: Z_INDEX.HEADER_LAYOUT,
            }}
        >
            <Grid
                style={{
                    width: '100%',
                    margin: '0px 8px',
                    gap: '16px',
                }}
                rows='1fr'
                columns='1fr 1fr'
            >
                <div>
                    <ModelDropdown />
                    <ModelConfigButton />
                    <Flex />
                    <RTDropdown />
                </div>
                <Row
                    style={{ gap: '0.25em' }}
                    columnAlign={Align.Center}
                >
                    <FormButton />
                    <Flex />
                    <ErrorLogButton />
                    <HistoryButton />
                    <AvatarButton />
                </Row>
            </Grid>
        </header>
    );
}

export default Header;
import { ModalProvider } from '@/hooks/useModal';
import { Grid } from '@/components/layout';
import ToastRenderer from '@/components/ToastAnchor/ToastRenderer';

import {
    Header,
    IOSection,
    SessionTabBar
} from './layout';
import { useFontSizeChanger, useShortcutEmitter } from './hooks';

function HomePage() {
    useShortcutEmitter();
    useFontSizeChanger();

    return (
        <ModalProvider>
            <Grid
                id='home'
                className='column relative'
                rows='40px 1fr 32px'
                columns='1fr'
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Header />
                <IOSection />
                <SessionTabBar />
            </Grid>
            <ToastRenderer
                top='40px'
                right='0'
            />  
        </ModalProvider>
    );
}

export default HomePage;
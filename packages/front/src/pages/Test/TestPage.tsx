import { useState } from 'react';
import { Grid, Row, Align } from '@/components/layout';
import { GIcon, GIconButton } from '@/components/atoms/GoogleFontIcon';
import Dropdown from '@/components/atoms/Dropdown';
import MarkdownTest from './MarkdownTest';
import FlowTest from './FlowTest';
import { emitNavigate } from '@/events/navigate';

function TestPage() {
    const [option, setOption] = useState<string>('');

    const handleExit = () => {
        emitNavigate('back');
    };

    const renderMainContent = () => {
        if (!option) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#666'
                }}>
                    Select an option from the dropdown
                </div>
            );
        }

        if (option === 'md-test') {
            return <MarkdownTest />;
        }
        if (option === 'flow-test') {
            return <FlowTest />;
        }

        return (
            <div
                style={{
                    padding: '20px',
                    display: 'block',
                }}
            >
                <h2>Debug: {option}</h2>
                <p>Content for {option} will be implemented here.</p>
            </div>
        );
    };

    return (
        <Grid
            className='relative'
            rows='40px 1fr'
            columns='1fr'
            style={{
                width: '100vw',
                height: '100vh',
            }}
        >
            <Row
                style={{
                    // height: '40px',
                    fontSize: '16px',
                }}
                columnAlign='center'
            >
                <Dropdown
                    style={{
                        minWidth: '150px',
                        height: '40px',
                        fontSize: '16px',
                    }}
                    value={option}
                    onChange={(value) => setOption(value)}
                    onItemNotFound={() => { }}
                >
                    <Dropdown.Item name="Markdown Test" value="md-test" />
                    <Dropdown.Item name="Flow Test" value="flow-test" />
                </Dropdown>

                <div style={{ flex: 1 }} />
                <div
                    style={{
                        height: '100%',
                        aspectRatio: '1 / 1',
                    }}
                >
                    <GIconButton
                        value='close'
                        onClick={handleExit}
                        style={{
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            aspectRatio: '1 / 1',
                        }}
                        hoverEffect='square'
                    />
                </div>
            </Row>

            {/* Main content area */}
            <main
                style={{
                    display: 'block',
                    overflow: 'auto',
                }}
            >
                {renderMainContent()}
            </main>
        </Grid>
    );
}

export default TestPage;
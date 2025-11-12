import { useState } from 'react';
import { Link } from 'react-router';

import Button from '@/components/atoms/Button';
import CheckBox from '@/components/atoms/CheckBox';
import Dropdown from '@/components/atoms/Dropdown';
import Slider from '@/components/atoms/Slider';
import EditableText from '@/components/atoms/EditableText';
import GIcon from '@/components/atoms/GoogleFontIcon/GIcon';
import IconButton from '@/components/atoms/GoogleFontIcon/IconButton';
import Well from '@/components/atoms/Well';
import Delimiter from '@/components/atoms/Delimiter';
import TabBar from '@/components/TabBar';

export default function ComponentsDemo() {
    const [text, setText] = useState('Click to edit');
    const [checked, setChecked] = useState(false);
    const [dropdown, setDropdown] = useState('item1');
    const [slider, setSlider] = useState(50);
    const [activeTab, setActiveTab] = useState('tab1');

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '2rem' }}>
                <Link to="/">← Back to Home</Link>
            </nav>

            <h1>Components Demo</h1>
            <p>Explore all reusable UI components available in this template.</p>

            <section style={{ marginTop: '2rem' }}>
                <h2>Atoms</h2>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Button</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button onClick={() => alert('Button 1')}>Primary</Button>
                        <Button onClick={() => alert('Button 2')} disabled>Disabled</Button>
                        <Button onClick={() => alert('Button 3')}>
                            <GIcon iconName="star" /> With Icon
                        </Button>
                    </div>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Icon Button</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <IconButton iconName="home" onClick={() => alert('Home')} />
                        <IconButton iconName="settings" onClick={() => alert('Settings')} />
                        <IconButton iconName="delete" onClick={() => alert('Delete')} />
                    </div>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>CheckBox</h3>
                    <CheckBox
                        checked={checked}
                        onChange={setChecked}
                        label="Toggle me"
                    />
                    <p>State: {checked ? 'Checked' : 'Unchecked'}</p>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Dropdown</h3>
                    <Dropdown value={dropdown} onChange={setDropdown}>
                        <Dropdown.Item value="item1">Item 1</Dropdown.Item>
                        <Dropdown.Item value="item2">Item 2</Dropdown.Item>
                        <Dropdown.Item value="item3">Item 3</Dropdown.Item>
                        <Dropdown.Group label="Group">
                            <Dropdown.Item value="item4">Item 4</Dropdown.Item>
                            <Dropdown.Item value="item5">Item 5</Dropdown.Item>
                        </Dropdown.Group>
                    </Dropdown>
                    <p>Selected: {dropdown}</p>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Slider</h3>
                    <Slider
                        value={slider}
                        onChange={setSlider}
                        min={0}
                        max={100}
                        step={1}
                    />
                    <p>Value: {slider}</p>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Editable Text</h3>
                    <EditableText
                        value={text}
                        onChange={setText}
                    />
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Delimiter</h3>
                    <Delimiter />
                    <p>A simple horizontal line for visual separation</p>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Well (Container)</h3>
                    <p>This entire section is wrapped in a Well component for visual grouping.</p>
                </Well>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2>TabBar</h2>
                <Well>
                    <TabBar activeTab={activeTab} onTabChange={setActiveTab}>
                        <TabBar.Tab id="tab1" label="Tab 1" />
                        <TabBar.Tab id="tab2" label="Tab 2" />
                        <TabBar.Tab id="tab3" label="Tab 3" />
                    </TabBar>
                    <div style={{ padding: '1rem', marginTop: '1rem', background: '#f5f5f5' }}>
                        {activeTab === 'tab1' && <div>Content for Tab 1</div>}
                        {activeTab === 'tab2' && <div>Content for Tab 2</div>}
                        {activeTab === 'tab3' && <div>Content for Tab 3</div>}
                    </div>
                </Well>
            </section>
        </div>
    );
}

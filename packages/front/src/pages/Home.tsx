import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import Button from '@/components/atoms/Button';
import CheckBox from '@/components/atoms/CheckBox';
import Dropdown from '@/components/atoms/Dropdown';
import Slider from '@/components/atoms/Slider';
import Well from '@/components/atoms/Well';

export default function Home() {
    const { t } = useTranslation();
    const [checked, setChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('option1');
    const [sliderValue, setSliderValue] = useState(50);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>{t('welcome')}</h1>
            <p>This is a reusable frontend template with common UI components and infrastructure.</p>

            <nav style={{ margin: '2rem 0' }}>
                <Link to="/components" style={{ marginRight: '1rem' }}>Components Demo</Link>
                <Link to="/forms" style={{ marginRight: '1rem' }}>Forms Demo</Link>
                <Link to="/modals" style={{ marginRight: '1rem' }}>Modals Demo</Link>
            </nav>

            <section style={{ marginTop: '2rem' }}>
                <h2>Quick Component Preview</h2>

                <Well style={{ marginBottom: '1rem' }}>
                    <h3>Buttons</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button onClick={() => alert('Clicked!')}>Primary Button</Button>
                        <Button onClick={() => alert('Clicked!')} disabled>Disabled Button</Button>
                    </div>
                </Well>

                <Well style={{ marginBottom: '1rem' }}>
                    <h3>Checkbox</h3>
                    <CheckBox
                        checked={checked}
                        onChange={setChecked}
                        label="Check me!"
                    />
                </Well>

                <Well style={{ marginBottom: '1rem' }}>
                    <h3>Dropdown</h3>
                    <Dropdown
                        value={selectedOption}
                        onChange={setSelectedOption}
                    >
                        <Dropdown.Item value="option1">Option 1</Dropdown.Item>
                        <Dropdown.Item value="option2">Option 2</Dropdown.Item>
                        <Dropdown.Item value="option3">Option 3</Dropdown.Item>
                    </Dropdown>
                </Well>

                <Well style={{ marginBottom: '1rem' }}>
                    <h3>Slider</h3>
                    <Slider
                        value={sliderValue}
                        onChange={setSliderValue}
                        min={0}
                        max={100}
                    />
                    <p>Value: {sliderValue}</p>
                </Well>
            </section>
        </div>
    );
}

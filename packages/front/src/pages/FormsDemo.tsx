import { useState } from 'react';
import { Link } from 'react-router';

import Button from '@/components/atoms/Button';
import Well from '@/components/atoms/Well';
import CheckBox from '@/components/atoms/CheckBox';
import Dropdown from '@/components/atoms/Dropdown';
import Slider from '@/components/atoms/Slider';
import Textarea from '@/components/atoms/Textarea';

export default function FormsDemo() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        agreeTerms: false,
        country: 'us',
        rating: 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify(formData, null, 2));
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '2rem' }}>
                <Link to="/">← Back to Home</Link>
            </nav>

            <h1>Forms Demo</h1>
            <p>Example of form components and form handling.</p>

            <Well style={{ marginTop: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="country" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Country
                        </label>
                        <Dropdown
                            value={formData.country}
                            onChange={(value) => updateField('country', value)}
                        >
                            <Dropdown.Item value="us">United States</Dropdown.Item>
                            <Dropdown.Item value="uk">United Kingdom</Dropdown.Item>
                            <Dropdown.Item value="ca">Canada</Dropdown.Item>
                            <Dropdown.Item value="kr">South Korea</Dropdown.Item>
                        </Dropdown>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Rating: {formData.rating}
                        </label>
                        <Slider
                            value={formData.rating}
                            onChange={(value) => updateField('rating', value)}
                            min={0}
                            max={10}
                            step={1}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Message
                        </label>
                        <Textarea
                            value={formData.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            placeholder="Enter your message..."
                            rows={5}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <CheckBox
                            checked={formData.agreeTerms}
                            onChange={(checked) => updateField('agreeTerms', checked)}
                            label="I agree to the terms and conditions"
                        />
                    </div>

                    <Button type="submit">Submit Form</Button>
                </form>
            </Well>

            <Well style={{ marginTop: '2rem' }}>
                <h3>Form Data Preview</h3>
                <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </Well>
        </div>
    );
}

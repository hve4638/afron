import Dropdown from '@/components/ui/Dropdown';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
    GeminiIcon,
} from 'components/Icons'
import useModelDropdown from './ModelDropdown.hook';
import { it } from 'node:test';

function ModelDropdown() {
    const {
        state: {
            options,
            modelId
        },
        setState,
    } = useModelDropdown();

    return (
        <Dropdown<string>
            style={{
                minWidth: '48px',
            }}
            itemProps={{
                renderGroup: ({ name }) => {
                    return (
                        <>
                            <RenderProviderIcon value={name} style={{
                                height: '1.2em'
                            }} />
                            <span>{name}</span>
                        </>
                    );
                }
            }}

            renderSelectedItem={({ name, value, parents }) => {
                return (
                    <>
                        {parents.map((parent) => (
                            <RenderProviderIcon key={parent.key} value={parent.name} />
                        ))}
                        <span>{name}</span>
                    </>
                );
            }}

            value={modelId}
            onChange={(next) => {
                setState.modelId(next);
            }}
            onItemNotFound={(first) => {
                if (first != null) setState.modelId(first);
            }}
        >
            {
                options.map((group, i) => (
                    <Dropdown.Group
                        name={group.name}
                        key={i + group.name}
                    >
                        {
                            group.list.map((item, i) => (
                                <Dropdown.Item
                                    name={item.name}
                                    value={item.value}
                                    key={i + item.name}
                                />
                            ))
                        }
                    </Dropdown.Group>
                ))
            }
        </Dropdown>
    )
}

interface RenderProviderIconProps {
    value: string;
    style?: React.CSSProperties;
}

function RenderProviderIcon({ value, style }: RenderProviderIconProps) {
    const baseStyle = {
        marginRight: '8px',
        ...style
    };

    switch (value) {
        case 'Gemini':
            return <GeminiIcon style={baseStyle} />
        case 'Anthropic':
            return <AnthropicIcon style={baseStyle} />
        case 'OpenAI':
            return <OpenAIIcon style={baseStyle} />
        case 'VertexAI':
            return <GoogleVertexAIIcon style={baseStyle} />
        default:
            return <></>
    }
}

export default ModelDropdown;
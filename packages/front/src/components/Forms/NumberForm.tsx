import { Flex, Row } from '@/components/layout';
import { NumberInput } from '@/components/Input';
import classNames from 'classnames';

interface NumberFormProps {
    name: string;

    value: number | null | undefined;
    onChange: (x?: number) => void;

    disabled?: boolean;
    allowEmpty?: boolean;
    allowDecimal?: boolean;
    instantChange?: boolean;

    className?: string;
    style?: React.CSSProperties;
    width?: string;
    placeholder?: string;
}

/// @TODO: 간헐적으로 allowEmpty가 활성화되었음에도 0이 자동 채워지는 문제
function NumberForm({
    name,
    value,
    onChange,

    disabled = false,
    allowEmpty = false,
    allowDecimal = false,
    instantChange = false,

    className = '',
    style = {},
    width,
    placeholder = '',
}: NumberFormProps) {
    return (
        <Row
            className={classNames({
                'dimmed-color': disabled,
            })}
            style={{
                width: '100%',
                height: '1.4em',
            }}
        >
            <span
                className={classNames('noflex undraggable', className)}
            >
                {name}
            </span>
            <Flex />
            <NumberInput
                style={{
                    ...style,
                    width,
                }}

                onChange={onChange}
                value={value}

                allowEmpty={allowEmpty}
                allowDecimal={allowDecimal}
                instantChange={instantChange}

                placeholder={placeholder}
                readOnly={disabled}
            />
        </Row>
    );
}

export default NumberForm;
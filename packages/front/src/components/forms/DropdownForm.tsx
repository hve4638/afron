import Dropdown from '@/components/ui/Dropdown';
import { Align, Flex, Row } from '@/components/layout';
import { ReactNodeProps } from '@/types';
import type {
    ItemProps,
    DropdownProps
} from '@/components/ui/Dropdown/types';
import classNames from 'classnames';

interface DropdownFormProps<T> extends ReactNodeProps.Common {
    children: React.ReactNode;

    value: T;
    onChange?: (item: T) => void;
    onItemNotFound?: (item: T | null) => void;
    align?: 'left' | 'right';

    label: React.ReactNode;

    dropdownProps?: DropdownPassthroughProps<T>
}

interface DropdownPassthroughProps<T> extends ReactNodeProps.Common {
    listProps?: ReactNodeProps.Common;
    itemProps?: ItemProps<T>;
}

function DropdownForm<T,>({
    className = '',
    style = {},

    label,
    align,

    value,
    onChange,
    onItemNotFound = () => { },
    children,

    dropdownProps = {},
}: DropdownFormProps<T>) {
    return (
        <Row
            className={className}
            style={{
                width: '100%',
                height: '1.4em',
                lineHeight: '1',
                ...style
            }}
            columnAlign={Align.Center}
        >
            <span
                className={classNames('noflex undraggable')}
            >
                {label}
            </span>
            <Flex />
            <Dropdown
                className={classNames(dropdownProps.className ?? '')}
                style={{
                    minWidth: '2em',
                    height: '100%',
                    fontSize: '0.8em',
                    ...(dropdownProps.style ?? {}),
                }}
                listProps={{
                    ...(dropdownProps.listProps ?? {}),
                }}
                itemProps={{
                    style: {
                        fontSize: '0.8em',
                        ...(dropdownProps.itemProps?.style ?? {}),
                    },
                }}

                align={align}
                value={value}
                onChange={onChange}
                onItemNotFound={onItemNotFound}
            >
                {children}
            </Dropdown>
        </Row>
    );
}

DropdownForm.Item = Dropdown.Item;
DropdownForm.Group = Dropdown.Group;

export { default as Dropdown } from '@/components/ui/Dropdown';
export default DropdownForm;
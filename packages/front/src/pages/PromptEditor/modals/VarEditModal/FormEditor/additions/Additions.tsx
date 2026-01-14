import { TextAddition } from './TextAddition';
import { NumberAddition } from './NumberAddition';
import { CheckboxAddition } from './CheckboxAddition';
import { SelectAddition } from './SelectAddition';
import { StructAddition } from './StructAddition';
import { ArrayAddition } from './ArrayAddition';

import { AdditionProps } from './types';
import { RTVarDataType } from '@afron/types';

export function Additions(props: AdditionProps & { dataType: RTVarDataType }) {
    return (
        <>
            {
                props.dataType === 'text' &&
                <TextAddition {...props as AdditionProps<'text'>} />
            }
            {
                props.dataType === 'number' &&
                <NumberAddition {...props as AdditionProps<'number'>} />
            }
            {
                props.dataType === 'checkbox' &&
                <CheckboxAddition {...props as AdditionProps<'checkbox'>} />
            }
            {
                props.dataType === 'select' &&
                <SelectAddition {...props as AdditionProps<'select'>} />
            }
            {
                props.dataType === 'array' &&
                <ArrayAddition {...props as AdditionProps<'array'>} />
            }
            {
                props.dataType === 'struct' &&
                <StructAddition {...props as AdditionProps<'struct'>} />
            }
        </>
    )
}

export default Additions;
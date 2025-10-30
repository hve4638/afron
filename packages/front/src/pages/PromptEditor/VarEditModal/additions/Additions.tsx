import TextAddition from './TextAddition';
import NumberAddition from './NumberAddition';
import CheckboxAddition from './CheckboxAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';
import ArrayAddition from './ArrayAddition';
import { RTVar, RTVarForm } from '@afron/types';
import { PromptVarForm } from '@/types/prompt-var';
import { PromptEditorDataVarAction } from '../../hooks';
import { AdditionsProps } from './types';

export function Additions(props: AdditionsProps) {
    const dataType = props.target.data.type;

    return (
        <>
            {
                dataType === 'text' &&
                <TextAddition {...props} />
            }
            {
                dataType === 'number' &&
                <NumberAddition {...props} />
            }
            {
                dataType === 'checkbox' &&
                <CheckboxAddition {...props} />
            }
            {
                dataType === 'select' &&
                <SelectAddition {...props} />
            }
            {
                dataType === 'array' &&
                <ArrayAddition {...props} />
            }
            {
                dataType === 'struct' &&
                <StructAddition {...props} />
            }
        </>
    )
}

export default Additions;
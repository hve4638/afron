

import { Column, Gap } from '@/components/layout';
import styles from '../SidePanel.module.scss';
import { Field } from '@/components/FormFields';
import { TextInput } from '@/components/Input';

export function WorkflowConfig() {
    return (
        <Column
            className={styles['left-panel']}
        >
            <div
                className='undraggable'
            >
                WorkflowConfig
            </div>
            <Gap h='8px' />
            <TextInput
                placeholder='Workflow 이름'
                value=''
                onChange={()=>{
                    ;
                }}
            />
        </Column>
    );
}
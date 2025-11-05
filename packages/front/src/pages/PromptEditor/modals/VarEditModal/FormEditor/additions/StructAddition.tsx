import classNames from 'classnames';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Flex } from 'components/layout';
import { AdditionProps } from './types';
import { genUntil } from '@/utils/genUntil';
import { RTVarConfig } from '@afron/types';

export function StructAddition({
    varId,
    varAction,
    config,
    onConfigChange,
}: AdditionProps<'struct'>) {
    // const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'struct'>>[2]) => varAction.setDataConfig(varId, 'struct', callback);

    const addField = () => {
        // promptVar.fields ??= [];
        onConfigChange(prev => {
            const next = { ...prev }
            next.fields ??= [];


            const [name, i] = genUntil(
                (i) => `field${i}`,
                (name) => !next.fields.some((f) => f.name === name)
            );

            const field: RTVarConfig.StructField = {
                type: 'text',
                name,
                display_name: `필드 ${i}`,
                config: {
                    text: {
                        placeholder: '',
                        allow_multiline: false,
                    }
                },
            }

            return {
                ...prev,
                fields: (prev.fields ?? []).concat([]),
            }
        });
    }

    return (
        <>
            <hr />
            <h2
                className='undraggable'
                style={{
                    marginBottom: '0.2em',
                }}
            >필드</h2>
            {
                config.fields != null &&
                config.fields.map((field, index) => (
                    <div
                        key={index}
                        className={classNames(
                            'undraggable',
                            'row-button',
                        )}
                        style={{
                            padding: '0px 4px 0px 16px',
                            fontSize: '0.9em',
                            height: '1.4em',
                        }}
                        onClick={() => {
                            // fieldVarRef 설정
                        }}
                    >
                        <span>{field.display_name}</span>
                        <span
                            style={{
                                fontSize: '0.9em',
                                margin: 'auto 0px 0px 4px',
                                color: 'grey',
                            }}
                        >{field.name}</span>
                        <Flex />
                        <GoogleFontIcon
                            style={{
                                width: '1.4em',
                                height: '1.4em',
                            }}
                            enableHoverEffect={true}
                            value='delete'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const fields = config.fields.filter((_, i) => i !== index);
                                onConfigChange(prev => ({
                                    ...prev,
                                    fields
                                }));

                                // fieldVarRef가 이 필드를 가르킬 경우 초기화
                            }}
                        />
                    </div>
                ))
            }
            <div
                className={classNames(
                    'undraggable center',
                    'row-button',
                )}
                onClick={() => addField()}
            >
                <GoogleFontIcon value='add_circle' />
                <span style={{ marginLeft: '0.5em' }}>필드 추가</span>
            </div>
        </>
    );
}

export default StructAddition;
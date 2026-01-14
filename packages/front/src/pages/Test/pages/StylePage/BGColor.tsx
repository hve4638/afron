import { Column, Row } from '@/components/layout';
import { Align } from '@/components/layout/types';

const bgColors = [
    // 기본 배경색
    [
        'bgcolor',
        'bgcolor-secondary',
        'bgcolor-highlight',
    ],
    // highlight 그룹
    [
        'bgcolor-highlight-1',
        'bgcolor-highlight-2',
        'bgcolor-highlight-3',
        'bgcolor-highlight-4',
    ],
    // well 그룹
    [
        'bgcolor-well',
        'bgcolor-well-highlight',
    ],
    // 컬러 배경
    [
        'bgcolor-red',
        'bgcolor-orange',
        'bgcolor-yellow',
        'bgcolor-lime',
        'bgcolor-green',
        'bgcolor-aqua',
        'bgcolor-blue',
        'bgcolor-purple',
        'bgcolor-reset',
    ],
];

export function BGColor() {
    return (
        <Column
            className='fill'
            style={{
                padding: '0.5em',
                fontSize: '8px',
                overflowX: 'hidden',
            }}
        >
            {bgColors.map((colorGroup, groupIndex) => (
                <Row
                    key={groupIndex}
                    style={{
                        flexWrap: 'wrap',
                    }}
                >
                    {colorGroup.map((color) => (
                        <Column
                            className='undraggable'
                            key={color}
                            columnAlign={Align.Center}
                            rowAlign={Align.Center}
                            style={{
                                width: '5em',
                                height: '5em',
                                backgroundColor: `var(--${color})`,
                                padding: '2px',
                                fontSize: '10px',
                                color: 'rgba(255,255,255,0.6)',
                                textAlign: 'center',
                                overflow: 'hidden',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div 
                                className='center'
                                style={{ width: '100%', wordBreak: 'break-word' }}
                            >
                                {color.replace('bgcolor-', '') || 'bgcolor'}
                            </div>
                        </Column>
                    ))}
                </Row>
            ))}
        </Column>
    )
}
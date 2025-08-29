import { useState } from 'react';
import classNames from 'classnames';
import { Grid } from '@/components/layout';
import InputField from '@/pages/Home/layout/IOSection/SingleIO/InputField';

function MarkdownTest() {
    const [inputText, setInputText] = useState<string>(`# H1
## 주제 1

너 정말 '핵심'을 찔렀어!
너 정말 "핵심"을 찔렀어!
너 정말 *핵심*을 찔렀어!
너 정말 **핵심**을 찔렀어!

흠?
  
감
나
무

ㅇ
ㅇㅇ
ㅇㅇㅇ

### 덜 중요

#### 덜덜 중요
**강조**
*조금 덜강조*
_흠_
- 가
  - 나
    - 다
1. 가
2. 에바
1. 에바바

| 가 | 나  | 다  |
|--|--|--|
| 12 | 23  | 343 |

${'```'}
여러 줄
코
드
${'```'}


${'`한줄 코드`'}
`);

    return (
        <div
            style={{
                // width: '100vw',
                // height: '100%',
                padding: '20px',
                boxSizing: 'border-box',
                fontSize: '16px',
            }}
        >
            <Grid
                className='column relative'
                rows='1fr'
                columns='1fr 1fr'
                style={{
                    width: '100%',
                    height: '100%',
                    gap: '16px',
                }}
            >
                {/* Input Section (Left) */}
                <InputField
                    className={classNames('flex')}
                    style={{
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                    }}
                    text={inputText}
                    onChange={(text: string) => setInputText(text)}
                />

                {/* Output Section (Right) */}
                <InputField
                    className={classNames('flex')}
                    style={{
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                    }}
                    text={inputText}
                    onChange={() => {}} // Read-only
                    readonly={true}
                    markdown={true}
                    tabIndex={-1}
                />
            </Grid>
        </div>
    );
}

export default MarkdownTest;
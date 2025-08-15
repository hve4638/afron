import classNames from 'classnames';

import { Z_INDEX } from '@/data/z';

import SingleIO from './SingleIO';
import ChatIO from './ChatIO';
import useIOSection from './IOSection.hook';

import styles from './IOSection.module.scss';

function IOSection() {
    const {
        inputLayoutType,
        color,
        tokenCount,
        inputTextRef,
        updateInputText,
    } = useIOSection();

    if (inputLayoutType === 'chat') {
        return (
            <ChatIO
                style={{
                    zIndex: Z_INDEX.INPUT_LAYOUT,
                }}
                inputText={inputTextRef.current}
                onChangeInputText={(value) => updateInputText(value)}

                color={color}
                tokenCount={tokenCount}
            />
        );
    }
    else {
        return (
            <SingleIO
                style={{
                    zIndex: Z_INDEX.INPUT_LAYOUT,
                }}
                inputText={inputTextRef.current}
                onChangeInputText={(value) => updateInputText(value)}

                color={color}
            />
        );
    }
}

export default IOSection;
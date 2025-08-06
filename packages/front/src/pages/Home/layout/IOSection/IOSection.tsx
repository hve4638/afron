import SingleIOLayout from './SingleIOLayout';
import ChatIOLayout from './ChatIOLayout';
import useIOSection from './IOSection.hook';

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
            <ChatIOLayout
                inputText={inputTextRef.current}
                onChangeInputText={(value) => updateInputText(value)}

                color={color}
                tokenCount={tokenCount}
            />
        );
    }
    else {
        return (
            <SingleIOLayout
                inputText={inputTextRef.current}
                onChangeInputText={(value) => updateInputText(value)}

                color={color}
                tokenCount={tokenCount}
            />
        );
    }
}

export default IOSection;
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { CommonProps } from "@/types";
import { GIconButton } from '@/components/GoogleFontIcon';

import style from './CodeBlock.module.scss';
import { Align, Flex, Row } from '@/components/layout';
import { CodeElement, parseCodeToText } from './utils';

interface CodeBlockProps extends CommonProps {
    language?: string;
    children: any;
}

function CodeBlock({ children }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const nodes: Array<CodeElement> = children.props.node.children;
    const text = useMemo(() => {
        return nodes.map(parseCodeToText).join('');
    }, [nodes]);

    const language = useMemo(() => {
        const className = children.props.className || '';
        return className.includes('language-')
            ? className.replace(/.*language-(\w+).*/, '$1')
            : '';   
    }, [children.props.className ?? '']);
    
    useEffect(() => {
        if (copied) {
            window.setTimeout(
                () => setCopied(false),
                500
            );
        }
    }, [copied])

    return (
        <div
            className={style['code-block-container']}
            style={{ display: 'block' }}
        >
            <Row
                className={style['code-block-header']}
                columnAlign={Align.Center}
            >
                <span className={classNames(style['code-block-language'], 'undraggable')}>{language}</span>
                <Flex />
                <GIconButton
                    hoverEffect='square'
                    value={
                        copied ? 'check' : 'content_copy'
                    }
                    onClick={(e) => {
                        e.stopPropagation();

                        setCopied(true);
                        navigator.clipboard.writeText(text);
                    }}
                />
            </Row>
            <pre className={classNames(style['code-block'])}>
                {children}
            </pre>
        </div>
    );
}

export default CodeBlock;
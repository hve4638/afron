import React, { ReactNode } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';

import { splitByQuotes } from '@/utils/splitByQuotes';
import classNames from 'classnames';
import CodeBlock from './components/CodeBlock';

import styles from './Markdown.module.scss';
import LocalAPIInstance from '@/api/local';

const customRenderers: Partial<Components> = {
    p({ children }) {
        let input: ReactNode[] | any;

        if (children == null) {
            return;
        }
        else if (typeof children === 'string') {
            input = [children];
        }
        else if (typeof children[Symbol.iterator] === 'function') {
            input = children;
        }
        else {
            return children;
        }

        const items: ReactNode[] = [];
        for (const item of input) {
            if (typeof item === 'string') {
                const splited = splitByQuotes(item);
                items.push(...splited);
            }
            else {
                items.push(item);
            }
        }


        return (
            <p>
                {
                    items.map((item: ReactNode, index) => {
                        if (typeof item !== 'string') {
                            return item;
                        }
                        else if (item.startsWith('"')) {
                            return (<span key={index} className='say'>{item}</span>);
                        }
                        else if (item.startsWith("'")) {
                            return (<span key={index} className='accent'>{item}</span>);
                        }
                        else {
                            return item;
                        }
                    })
                }
            </p>
        );
    },
    em({ children }) {
        return <em className='think'>{children}</em>;
    },
    code(data) {
        return <code>{data.children}</code>;
    },
    pre(props) {
        const { children, className } = props;
        const child = React.Children.only(children) as React.ReactElement;
        if (child && (child.type as any)?.name === 'code') {
            return (
                <CodeBlock>
                    {children}
                </CodeBlock>
            );
        }
        return <pre className={className} {...props}>{children}</pre>;
    },
    a({ children, href }) {
        return <a
            className='link'
            target='_blank'
            rel='noopener noreferrer'
            onClick={()=>{
                if (href) {
                    LocalAPIInstance.general.openBrowser(href);
                }
            }}
        >{children}
        </a>;
    }
};

function MarkdownArea({
    className = '',
    style = {},
    onKeyDown,
    content
}: { content: string, className?: string, style?: React.CSSProperties, onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void }) {
    return (
        <div
            className={classNames(styles['markdown-area'], className)}
            style={{
                ...style,
                display: 'block',
            }}
            onKeyDown={onKeyDown}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeHighlight]}
                // rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={customRenderers}
            >{content}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownArea;
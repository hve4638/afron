import { forwardRef } from 'react';
import { Align } from './types';
import { CommonProps, DragActionProps, MouseActionProps } from '@/types';

export interface AlignedDivProps extends CommonProps, MouseActionProps<HTMLDivElement>, DragActionProps<HTMLDivElement> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;

    rowAlign?: Align;
    columnAlign?: Align;
    reverse?: boolean;

    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onRClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseMove?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    draggable?: boolean;
}

export const Column = forwardRef<HTMLDivElement, AlignedDivProps>(
    (
        props: AlignedDivProps,
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={props.className}
                style={{
                    display: 'flex',
                    flexDirection: props.reverse ? 'column-reverse' : 'column',
                    justifyContent: props.columnAlign,
                    alignItems: props.rowAlign,
                    ...props.style,
                }}
                onClick={props.onClick}
            >
                {props.children}
            </div>
        )
    }
);


export const Row = forwardRef(
    (
        props: AlignedDivProps,
        ref: React.LegacyRef<HTMLDivElement>
    ) => {
        const {
            className = '',
            style = {},
            rowAlign = Align.Start,
            columnAlign = Align.Start,
            reverse = false,
        } = props;

        return (
            <div
                ref={ref}
                className={className}
                style={{
                    display: 'flex',
                    flexDirection: reverse ? 'row-reverse' : 'row',
                    justifyContent: rowAlign,
                    alignItems: columnAlign,
                    ...style,
                }}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                onMouseMove={props.onMouseMove}
                onMouseDown={props.onMouseDown}

                onDragStart={props.onDragStart}
                onDragEnd={props.onDragEnd}
                onDragOver={props.onDragOver}
                onDragEnter={props.onDragEnter}
                onDragLeave={props.onDragLeave}
                onDrop={props.onDrop}

                onDoubleClick={props.onDoubleClick}
                onContextMenu={props.onRClick}
            >
                {props.children}
            </div>
        );
    }
);
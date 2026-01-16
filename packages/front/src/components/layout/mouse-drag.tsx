import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "utils/math";

interface MouseDragProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onDragBegin?: (x:number, y:number) => void;
    onDrag?: (x:number, y:number) => void;
    onDragEnd?: (x:number, y:number) => void;
    onClick?: (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    relative?: boolean;
    clampToBound?: boolean;
}

function MouseDrag({
    className='',
    style={},
    children,
    onDragBegin = (x, y)=>{},
    onDrag = (x, y)=>{},
    onDragEnd = (x, y)=>{},
    onClick = (e) => {},
    relative = true,
    clampToBound = false,
}:MouseDragProps) {
    const dragContainerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const draggingRef = useRef(false);
    const prevPosRef = useRef({ x: 0, y: 0 });

    const onDragRef = useRef(onDrag);
    const onDragEndRef = useRef(onDragEnd);
    onDragRef.current = onDrag;
    onDragEndRef.current = onDragEnd;

    const getMousePosition = useCallback(
        (e: MouseEvent) => {
            if (!dragContainerRef.current) {
                return { x: 0, y: 0 };
            }
            else if (relative) {
                const rect = dragContainerRef.current.getBoundingClientRect();
                let x = e.clientX;
                let y = e.clientY;
                if (clampToBound) {
                    x = clamp(x, rect.left, rect.right);
                    y = clamp(y, rect.top, rect.bottom);
                }

                return {
                    x: x - rect.left,
                    y: y - rect.top,
                };
            }
            else {
                return { x: e.clientX, y: e.clientY };
            }
        },
        [relative, clampToBound]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (draggingRef.current) {
                const {x, y} = getMousePosition(e);
                if (prevPosRef.current.x !== x || prevPosRef.current.y !== y) {
                    prevPosRef.current.x = x;
                    prevPosRef.current.y = y;
                    onDragRef.current(x, y);
                }
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (draggingRef.current) {
                const {x, y} = getMousePosition(e);
                draggingRef.current = false;
                setDragging(false);
                onDragEndRef.current(x, y);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [getMousePosition]);
    
    return (
        <div
            ref={dragContainerRef}
            className={className}
            style={style}
            onMouseDown={(e)=>{
                if (e.button === 0) {
                    draggingRef.current = true;
                    setDragging(true);

                    const {x, y} = getMousePosition(e as unknown as MouseEvent);
                    prevPosRef.current.x = x;
                    prevPosRef.current.y = y;
                    onDragBegin(x, y);
                }
            }}
            onClick={(e)=>onClick(e)}
        >
            {children ?? <></>}
        </div>
    )
}

export default MouseDrag;
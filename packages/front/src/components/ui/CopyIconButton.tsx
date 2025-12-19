import { CommonProps } from "@/types";
import { GIconButton } from "../atoms/GoogleFontIcon";
import { EventNames, useEvent } from "@/hooks/useEvent";
import { useRef, useState } from "react";

interface CopyIconButtonProps extends CommonProps {
    onClick: () => boolean|void;
    handleEvent?: EventNames;
}

function CopyIconButton({
    onClick,
    handleEvent,
}: CopyIconButtonProps) {
    const [checked, setChecked] = useState(false);
    const timeoutRef = useRef<number>(null);

    const enableChecked = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setChecked(true);
        timeoutRef.current = window.setTimeout(() => {
            setChecked(false);
        }, 500);
    }

    useEvent(handleEvent as EventNames, () => {
        onClick();
    }, [handleEvent], handleEvent != undefined);

    return (
        <GIconButton
            value={
                checked
                    ? 'check'
                    : 'content_copy'
            }
            hoverEffect='square'
            onClick={()=>{
                const result = onClick();

                if (result ?? true) {
                    enableChecked();
                }
            }}
        />
    )
}

export default CopyIconButton;
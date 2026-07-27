import { CommonProps } from "@/types";
import { GIconButton } from "../atoms/GoogleFontIcon";
import { useRef, useState } from "react";

interface CopyIconButtonProps extends CommonProps {
    onClick: () => boolean|void;
}

function CopyIconButton({
    onClick,
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
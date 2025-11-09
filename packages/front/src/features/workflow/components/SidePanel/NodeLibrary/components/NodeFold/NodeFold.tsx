import Delimiter from '@/components/Delimiter';
import { Gap } from '@/components/layout';

interface NodeFoldProps {
    label: string;
    children?: React.ReactNode;
}

export function NodeFold({
    label,
    children
}: NodeFoldProps) {
    return (
        <>
            <div
                className='undraggable'
            >{label}</div>
            <Delimiter />
            <Gap h='2px' />
            {children}
            <Gap h='2px' />
        </>
    );
}
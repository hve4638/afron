
interface GapProps {
    w?: string | number;
    h?: string | number;
}

function Gap({ h, w }: GapProps) {
    return <div style={{ height: h, width: w }} />;
}

export default Gap;
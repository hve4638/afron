import CountDisplay from "./CountDisplay";
import CountButtons from "./CountButton";

export default function Count({
    count,
    increment,
    decrement,
    reset,
}: {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}) {
    return (
        <>
            <CountDisplay count={count} />
            <CountButtons increment={increment} decrement={decrement} reset={reset} />
        </>
    );
}
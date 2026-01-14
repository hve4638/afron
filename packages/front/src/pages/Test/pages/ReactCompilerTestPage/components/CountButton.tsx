export default function CountButtons({
    increment,
    decrement,
    reset,
}: {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}) {
    console.log("CountButtons");
    return (
        <>
            <button style={{ color: 'black' }} onClick={decrement}>감소</button>
            <button style={{ color: 'black' }} onClick={reset}>리셋</button>
            <button style={{ color: 'black' }} onClick={increment}>증가</button>
        </>
    );
}
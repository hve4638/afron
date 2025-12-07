import { useState } from "react";
import Count from "./components/Count";


// react 19 및 리액트 컴파일러 정상 설치 확인용
export function ReactCompilerTestPage() {
    const [count, setCount] = useState(0);
    const increment = () => setCount((count) => count + 1);
    const reset = () => setCount(0);
    const decrement = () => setCount((count) => count - 1);

    return (
        <>
            <Count
                count={count}
                increment={increment}
                decrement={decrement}
                reset={reset}
            />
        </>
    );
}
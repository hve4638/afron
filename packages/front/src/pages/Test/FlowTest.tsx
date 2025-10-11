import '@xyflow/react/dist/style.css';
import { buildNode, Workflow } from '@/features/workflow';

const initialNodes = [
    buildNode('1', { x: 0, y: 0 }, 'rt-input'),
    buildNode('2', { x: 250, y: 0 }, 'prompt-template'),
    buildNode('3', { x: 250, y: 200 }, 'llm-fetch'),
    buildNode('4', { x: 500, y: 0 }, 'rt-output'),
];

const initialEdges = [
    // { id: 'e1-2', source: '1', sourceHandle: 'output1', target: '2', targetHandle: '2a' },
    // { id: 'e2-3', source: '2', sourceHandle: '2b', target: '3', targetHandle: 'input3' },
];

function FlowTest() {
    return (
        <div>Not Implemented</div>
        // <Workflow
        //     nodes={initialNodes}
        //     edges={initialEdges}
        //     data={{} as any}
        // />
    );
}

export default FlowTest;
import { Link } from 'react-router';
import { useModal } from '@/hooks/useModal';

import Button from '@/components/atoms/Button';
import Well from '@/components/atoms/Well';
import ConfirmDialog from '@/modals/Dialog/ConfirmDialog';
import InfoDialog from '@/modals/Dialog/InfoDialog';
import ChoiceDialog from '@/modals/Dialog/ChoiceDialog';
import ProgressModal from '@/modals/ProgressModal';

export default function ModalsDemo() {
    const confirmModal = useModal();
    const infoModal = useModal();
    const choiceModal = useModal();
    const progressModal = useModal();

    const handleConfirm = async () => {
        const result = await confirmModal.open();
        alert(`Confirm result: ${result}`);
    };

    const handleInfo = async () => {
        await infoModal.open();
        alert('Info modal closed');
    };

    const handleChoice = async () => {
        const result = await choiceModal.open();
        alert(`Choice result: ${result}`);
    };

    const handleProgress = async () => {
        progressModal.open();
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Update progress if needed
        }
        progressModal.close();
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '2rem' }}>
                <Link to="/">← Back to Home</Link>
            </nav>

            <h1>Modals Demo</h1>
            <p>Explore reusable modal components available in this template.</p>

            <section style={{ marginTop: '2rem' }}>
                <h2>Dialog Modals</h2>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Confirm Dialog</h3>
                    <p>A modal for user confirmation with Yes/No options.</p>
                    <Button onClick={handleConfirm}>Open Confirm Dialog</Button>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Info Dialog</h3>
                    <p>A simple informational modal with an OK button.</p>
                    <Button onClick={handleInfo}>Open Info Dialog</Button>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Choice Dialog</h3>
                    <p>A modal that allows users to choose between multiple options.</p>
                    <Button onClick={handleChoice}>Open Choice Dialog</Button>
                </Well>

                <Well style={{ marginBottom: '1.5rem' }}>
                    <h3>Progress Modal</h3>
                    <p>A modal showing progress for long-running operations.</p>
                    <Button onClick={handleProgress}>Open Progress Modal</Button>
                </Well>
            </section>

            {/* Modal Components */}
            <ConfirmDialog
                modal={confirmModal}
                title="Confirm Action"
                message="Are you sure you want to proceed?"
            />

            <InfoDialog
                modal={infoModal}
                title="Information"
                message="This is an informational message."
            />

            <ChoiceDialog
                modal={choiceModal}
                title="Make a Choice"
                message="Please select an option:"
                choices={[
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                    { label: 'Option C', value: 'c' },
                ]}
            />

            <ProgressModal
                modal={progressModal}
                title="Processing..."
                message="Please wait while we process your request."
            />
        </div>
    );
}

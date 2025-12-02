import DivButton from '@/components/atoms/DivButton';
import { GIcon } from '@/components/atoms/GoogleFontIcon';
import AddAPIKeyModal from './AddAPIKeyModal';
import { useModal } from '@/features/modal';

interface AddAPIKeyButtonProps {
    title: string;
    onAddAPIKey: (data: { authKey: string; memo: string; }) => void;
}

function AddAPIKeyButton({
    title,
    onAddAPIKey = (data) => {}
}: AddAPIKeyButtonProps) {
    const modal = useModal();

    return (
        <DivButton
            center={true}
            onClick={() => {
                modal.open(
                    <AddAPIKeyModal
                        title={title}
                        onSubmit={onAddAPIKey}
                        apiKeyName='API 키'
                    />
                );
            }}
        >
            <GIcon
                value='add_circle'
                style={{
                    marginRight: '0.25em',
                }}
            />
            <span>새로운 키 입력</span>
        </DivButton>
    )
}

export default AddAPIKeyButton;
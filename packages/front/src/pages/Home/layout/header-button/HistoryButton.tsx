import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { useModal } from '@/features/modal';
import HistoryModal from '@/modals/HistoryModal';

function HistoryButton() {
    const modal = useModal();

    return (
        <GIconButton
            value='history'
            hoverEffect='circle'
            style={{
                height: '100%',
                aspectRatio: '1/1',
                fontSize: '2em',
                cursor: 'pointer',
            }}
            onClick={() => {
                modal.open(<HistoryModal/>);
            }}
        />
    );
}

export default HistoryButton;
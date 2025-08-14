import { GIconButton } from '@/components/GoogleFontIcon';
import { HistoryData } from '@/features/session-history';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import { useHistoryStore } from '@/stores';

function DeleteButton({ data, origin }: { data: HistoryData, origin: 'in' | 'out' }) {
    const modal = useModal();
    const historyState = useHistoryStore();
    return (
        <GIconButton
            value='delete'
            hoverEffect='square'
            onClick={(e) => {
                e.stopPropagation();

                modal.open(DeleteConfirmDialog
                    , {
                    onDelete: async () => {
                        await historyState.actions.deleteMessage(data.id, origin);

                        return true;
                    }
                });
            }}
        />
    )
}

export default DeleteButton;
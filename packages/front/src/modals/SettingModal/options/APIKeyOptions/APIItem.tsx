import DropdownOld from '@/components/DropdownOld';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import { Align, Flex, Row } from '@/components/layout';
import ProfileEvent from '@/features/profile-event';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import { use } from 'i18next';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip'

type APIItemProps = {
    item: APIKeyMetadata;
    onDelete: () => void;
    onChangeType: (type: 'primary' | 'secondary') => void;
}

function APIItem({ item, onDelete, onChangeType }: APIItemProps) {
    const modal = useModal();
    const [verified, setVerified] = useState(true);

    useEffect(() => {
        ProfileEvent.auth.verify(item.secret_id)
            .then((result) => {
                setVerified(result);
            });
    }, [item.secret_id])

    return (
        <Row
            className='undraggable'
            style={{
                padding: '0 0.5em',
                gap: '0.25em',
            }}
            columnAlign={Align.Center}
        >
            <Tooltip
                style={{ fontSize:'0.8em', padding:'0.2em 1em'}}
                anchorSelect='.noverified'
                delayShow={250}
            >키 검증에 실패했습니다</Tooltip>
            {
                verified === false &&
                <GIcon className='noverified' value='warning'/>
            }
            <small className='secondary-color'>{item.display_name}</small>
            {
                item.memo != null &&
                item.memo !== '' &&
                <small>({item.memo})</small>
            }
            <Flex />
            {/* <DropdownOld
                style={{
                    // fontSize: '0.8em',
                }}
                items={[{name:'주', key:'primary'}, {name:'보조', key:'secondary'}]}
                value={item.type}
                onChange={(value)=>{
                    onChangeType(value.key as 'primary'|'secondary');
                }}
                onItemNotFound={()=>{
                    onChangeType('primary');
                }}
            /> */}
            <GIconButton
                className='undraggable clickable'
                style={{
                    height: '100%',
                    cursor: 'pointer',
                }}
                value='delete'
                hoverEffect='square'

                onClick={() => {
                    modal.open(DeleteConfirmDialog, {
                        onDelete: async () => {
                            onDelete();
                            return true;
                        }
                    })

                }}
            />
        </Row>
    );
}

export default APIItem;
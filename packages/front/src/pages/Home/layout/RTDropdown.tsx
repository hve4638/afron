import { useTranslation } from 'react-i18next';

import { GIcon, GoogleFontIcon } from '@/components/atoms/GoogleFontIcon';
import DivButton from '@/components/atoms/DivButton';
import Dropdown from '@/components/atoms/Dropdown';
import useRTDropdown from './RTDropdown.hook';
import { emitEvent } from '@/hooks/useEvent';

const CREATE_NEW_PROMPT = 'CREATE_NEW_PROMPT';
function RTDropdown() {
    const { t } = useTranslation();
    const {
        state: {
            tree,

            rtId,
        },
        action: {
            changeRT
        }
    } = useRTDropdown();

    return (
        tree.length === 0
            ? <DivButton
                onClick={() => emitEvent('open_new_rt_modal')}
            >
                <GoogleFontIcon value='add' style={{ marginRight: '4px' }} />
                <span>새 요청 템플릿</span>
            </DivButton>
            : <Dropdown
                style={{
                    minWidth: '48px',
                }}
                value={rtId}
                itemProps={{
                    style: {
                        fontSize: '0.9em',
                    },
                    renderItem: ({ name, value }) => {
                        if (value === CREATE_NEW_PROMPT) {
                            return <>
                                <GoogleFontIcon value='add' style={{ marginRight: '4px' }} />
                                <span>{name}</span>
                            </>
                        }
                        
                        return name;
                    },
                    renderGroup: ({ name, }) => {
                        return <>
                            <span>{name}</span>
                            <GIcon
                                style={{
                                    display: 'inline'
                                }}
                                value='arrow_right'
                            />
                        </>
                    },
                }}
                onChange={(next) => {
                    if (next === CREATE_NEW_PROMPT) {
                        emitEvent('open_new_rt_modal')
                    }
                    else {
                        changeRT(next);
                    }
                }}
                onItemNotFound={(firstRTId) => {
                    if (firstRTId != null) changeRT(firstRTId);
                }}
            >
                {
                    tree.map((item, i) => (
                        item.type === 'node'
                            ? <Dropdown.Item name={item.name} value={item.id} key={i + item.name} />
                            : <Dropdown.Group name={item.name} key={i + item.name}>
                                {
                                    item.children.map((child, i) => (
                                        <Dropdown.Item name={child.name} value={child.id} key={i + child.id} />
                                    ))
                                }
                            </Dropdown.Group>
                    ))
                }
                <Dropdown.Item
                    name={t('rt.new_rt')}
                    value={CREATE_NEW_PROMPT}
                />
            </Dropdown>
    );
}

export default RTDropdown;
import { useEffect } from 'react';
import { useStartupStore } from '../store';

import LocalAPI from '@/api/local';

import { ChoiceDialog } from '@/modals/Dialog';
import { useModal } from '@/features/modal';

function MigrationStep() {
    const { update } = useStartupStore();
    const modal = useModal();

    const finish = () => {
        update.nextStep();
    }

    useEffect(() => {
        LocalAPI.general.existsLegacyData()
            .then((exists) => {
                console.log(exists);
                if (exists) {
                    modal.open(
                        <ChoiceDialog
                            title={'마이그레이션'}
                            choices={[
                                { text: '마이그레이션', tone: 'default' },
                                { text: '취소', tone: 'dimmed' },
                            ]}
                            onSelect={async (choice, index) => {
                                if (index === 0) {
                                    await LocalAPI.general.migrateLegacyData();
                                    finish();
                                }
                                else {
                                    await LocalAPI.general.ignoreLegacyData();
                                    finish();
                                }

                                return true;
                            }}
                        >
                            <div style={{ display: 'block' }}>
                                <div>이전 버전 데이터를 가져오겠습니까?</div>
                            </div>
                        </ChoiceDialog >
                    );
                }
                else {
                    finish();
                }
            })
            .catch((error) => {
                finish();
            });

    }, []);


    return null;
}

export default MigrationStep;

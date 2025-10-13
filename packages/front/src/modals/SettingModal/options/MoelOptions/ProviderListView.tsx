import classNames from 'classnames';

import { Column } from '@/components/layout';

import styles from './styles.module.scss';
import { ChatAIModelCategory } from '@afron/types';

interface ProviderListViewProps {
    modelCategories: ChatAIModelCategory[];
    selected: number;
    onChange: (index: number) => void;
}

function ProviderListView({ modelCategories, selected, onChange }: ProviderListViewProps) {
    return (
        <Column
            className={styles['model-list']}
            style={{
                minHeight: '100%',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            {
                modelCategories.map((category, index) => (
                    <div
                        key={`${category.categoryId}_${index}`}
                        className={
                            classNames(
                                styles['provider'],
                                {
                                    [styles['selected']]: selected === index,
                                }
                            )
                        }
                        onClick={() => onChange(index)}
                    >
                        {category.categoryName}
                    </div>
                ))
            }
            <div
                className={
                    classNames(
                        styles['provider'],
                        {
                            [styles['selected']]: selected === modelCategories.length,
                        }
                    )
                }
                onClick={() => onChange(modelCategories.length)}
            >
                Custom
            </div>
        </Column>
    )
}

export default ProviderListView;
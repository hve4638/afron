import { EditableText } from '@/components/EditableText';
import { GIcon } from '@/components/GoogleFontIcon';
import { Flex } from '@/components/layout';
import TreeView, { directory, node } from '@/components/TreeView';

export function PromptTemplateTreeView() {
    const tree = [
        directory('Root', 'root', [
            node('File 1', 'file1 content'),
            node('File 2', 'file2 content'),
        ]),
    ];

    return (
        <TreeView<string>
            tree={tree}
            onChange={(next) => {
                console.log('Tree changed:', next);
            }}
            relocatable={true}
            renderLeafNode={({ name, value }) => {
                return (
                    <div>{name}</div>
                );
            }}
            renderDirectoryNode={({ name, value }) => {
                return (
                    <>
                        <GIcon
                            value='folder_open'
                            style={{
                                fontSize: '22px',
                                width: '22px',
                                height: '22px',
                            }}
                        />
                        <Flex style={{ paddingLeft: '0.25em' }}>
                            <EditableText
                                value={name}
                                onChange={(renamed) => {

                                }}
                            />
                        </Flex>
                    </>
                );
            }}
        />
    )
}
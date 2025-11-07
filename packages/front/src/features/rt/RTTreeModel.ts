import { useProfileAPIStore } from '@/stores';
import type {
    ITreeDirectoryNode,
    ITreeLeafNode,
    ITreeNode
} from '@/components/TreeView';
import ProfileEvent from '../profile-event';
import { RTMetadataDirectory, RTMetadataNode, RTMetadataTree } from '@afron/types';
import { ProfileAPI } from '@/api/profiles';
import { RTModel } from './RTModel';

type RTTree = ITreeNode<string>[];
type RTTreeNode = ITreeNode<string>;

export class RTTreeModel {
    #rtModel: RTModel;

    #dirIdCounter: number = 0;
    #rawTree?: Readonly<RTMetadataTree>;
    #tree?: Readonly<RTTree>;
    #api: ProfileAPI;

    constructor() {
        const { api } = useProfileAPIStore.getState();
        this.#api = api;
        this.#rtModel = new RTModel();
    }

    #nextDirId() {
        return `__dir_${this.#dirIdCounter++}`;
    }

    async getRawTree(force: boolean = false): Promise<Readonly<RTMetadataTree>> {
        if (this.#rawTree == null || force) {
            this.#rawTree = await this.#api.rts.getTree();
        }

        return this.#rawTree;
    }
    async getTree(force: boolean = false): Promise<Readonly<RTTree>> {
        if (this.#tree == null || force) {
            this.#tree = await this.getRawTree(force)
                .then(
                    (tree) => this.#convertToTree(tree)
                )
        }

        return this.#tree;
    }

    /**
     * 노드/디렉토리 이름 변경
     * @param value 트리 내 노드의 value
     * @param newName 
     * @returns 
     */
    async rename(
        value: string,
        newName: string
    ) {
        const tree = await this.getTree();

        const nameTrimmed = newName.trim();
        if (nameTrimmed.length === 0) {
            return;
        }

        const nodeIndexes = this.#findNodeIndexes(tree, value);
        if (nodeIndexes == null) {
            return;
        }

        let target: ITreeNode<string> | null = null;
        const mapRename = (node: ITreeNode<string>) => {
            if (node.type === 'directory') {
                return {
                    ...node,
                    children: node.children.map(mapRename),
                }
            }
            else if (node.value !== value) {
                return node;
            }
            else {
                target = node;
                return {
                    ...node,
                    name: nameTrimmed,
                }
            }
        }

        const next = tree.map(mapRename);
        if (target) {
            // ts 제어흐름 분석이 안돼서 target이 never로 처리되서 강제 캐스팅
            const node = target as ITreeNode<string>;

            if (node.type === 'node') {
                // directory명은 relocate로만 처리됨
                await this.#rtModel.renameRT(value, nameTrimmed);
            }
            await this.relocate(next);
        }
    }

    #findNode(nodes: RTTree, value: string): ITreeNode<string> | null {
        for (const node of nodes) {
            if (node.value === value) {
                return node;
            }
            if (node.type === 'directory') {
                const found = this.#findNode(node.children, value);
                if (found) return found;
            }
        }

        return null;
    }
    /**
     * Tree 내 노드 검색 후 인덱스 배열 반환
     */
    #findNodeIndexes(nodes: Readonly<RTTree>, value: string): number[] | null {
        for (const i in nodes) {
            const node = nodes[i];
            if (node.value === value) {
                return [Number(i)];
            }
            if (node.type === 'directory') {
                const found = this.#findNodeIndexes(node.children, value);
                if (found) {
                    return [Number(i), ...found];
                }
            }
        }

        return null;
    }
    /**
     * Tree 마지막에 디렉토리 노드 추가
     */
    async addDirectory(directoryName: string = 'New Directory') {
        this.relocate([
            ...await this.getTree(),
            {
                name: directoryName,
                type: 'directory',
                value: this.#nextDirId(),
                children: [],
            } satisfies ITreeDirectoryNode<string>,
        ]);
    }

    /**
     * DirectoryNode 삭제
     */
    async deleteDirectory(value: string) {
        const tree = await this.getTree();
        
        const flatMapDelete = (n: RTTreeNode): RTTreeNode[] => {
            if (n.type === 'directory') {
                if (n.value !== value) {
                    return [n];
                }
                else {
                    return [
                        ...n.children
                    ]
                }
            }
            else {
                return [n];
            }
        }

        const next = tree.flatMap(flatMapDelete);
        this.relocate(next);
    }

    /**
     * Node 삭제
     */
    async deleteNode(value: string) {
        await this.#rtModel.removeRT(value);

        // 트리 갱신
        this.getTree(true);
    }

    /**
     * 트리 노드 순서 재배치
     * 
     * directory 추가/제거 및 노드명 변경 시 사용
     * 
     * relocate를 통해 노드 추가/제거할 수 없음
     */
    async relocate(tree: Readonly<RTTree>) {
        this.#tree = tree;

        const raw = this.#convertToRawTree(tree);
        this.#api.rts.updateTree(raw);
    }

    /**
     * RTMetadataTree -> RTTree 변환
     * 
     * 디렉토리에 임의의 식별자 부여됨
     */
    #convertToTree(tree: Readonly<RTMetadataTree>): RTTree {
        return tree.map(
            (node) => {
                if (node.type === 'directory') {
                    return {
                        name: node.name,
                        value: this.#nextDirId(),
                        type: 'directory',
                        children: node.children.map((child) => ({
                            type: 'node',
                            name: child.name,
                            value: child.id,
                        })),
                    } satisfies ITreeDirectoryNode<string>;
                }

                return {
                    type: 'node',
                    name: node.name,
                    value: node.id,
                } satisfies ITreeLeafNode<string>;
            }
        );
    }
    /**
     * RTTree -> RTMetadataTree 변환
     */
    #convertToRawTree(tree: Readonly<RTTree>): RTMetadataTree {
        return tree.map(
            (node) => {
                if (node.type === 'directory') {
                    return {
                        type: 'directory',
                        name: node.name,
                        children: node.children.map(
                            (child) => ({
                                type: 'node',
                                name: child.name,
                                id: child.value,
                            } satisfies RTMetadataNode)
                        ),
                    } satisfies RTMetadataDirectory;
                }
                else {
                    return {
                        type: 'node',
                        name: node.name,
                        id: node.value,
                    } satisfies RTMetadataNode;
                }
            }
        ) satisfies RTMetadataTree;
    }
}
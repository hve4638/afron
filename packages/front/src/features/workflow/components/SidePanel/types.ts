export const SidePanelSections = {
    File: 'file',
    NodeLibrary: 'node_library',
} as const;
export type SidePanelSections = typeof SidePanelSections[keyof typeof SidePanelSections];

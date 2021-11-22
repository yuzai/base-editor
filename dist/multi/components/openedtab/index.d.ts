import React from 'react';
import './index.less';
declare const OpenedTab: React.FC<{
    openedFiles: Array<{
        status?: string;
        path: string;
    }>;
    onPathChange?: (key: string) => void;
    currentPath?: string;
    onCloseFile: (path: string) => void;
}>;
export default OpenedTab;

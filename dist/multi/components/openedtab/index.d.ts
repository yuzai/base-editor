import React, { MouseEventHandler } from 'react';
import './index.less';
declare const OpenedTab: React.FC<{
    openedFiles: Array<{
        status?: string;
        path: string;
    }>;
    onPathChange?: MouseEventHandler<HTMLDivElement>;
    currentPath?: string;
    onCloseFile: (path: string) => void;
}>;
export default OpenedTab;

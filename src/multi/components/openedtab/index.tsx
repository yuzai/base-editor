import React, { MouseEventHandler } from 'react';
import './index.less';

const OpenedTab: React.FC<{
    openedFiles: Array<{
        status?: string,
        path: string,
    }>,
    onPathChange?: MouseEventHandler<HTMLSpanElement>,
}> = ({
    openedFiles,
    onPathChange,
}) => {
    return (
        <div className="music-monaco-editor-opened-tab">
            {
                openedFiles.map(file => {
                    const type = file.path.split('/').slice(-1)[0];
                    return (
                        <span
                            data-src={file.path}
                            className="music-monaco-editor-opened-tab-item"
                            onClick={onPathChange}>
                            {type}
                        </span>)
                })
            }
        </div>
    )
}

export default OpenedTab;
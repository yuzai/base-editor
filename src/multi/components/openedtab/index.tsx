import React from 'react';
import './index.less';

const OpenedTab: React.FC<{
    openedFiles: Array<{
        status?: string,
        path: string,
    }>
}> = ({
    openedFiles,
}) => {
    return (
        <div className="music-monaco-editor-opened-tab">
            {
                openedFiles.map(file => {
                    const type = file.path.split('/').slice(-1)[0];
                    return (
                        <span className="music-monaco-editor-opened-tab-item">
                            {type}
                        </span>)
                })
            }
        </div>
    )
}

export default OpenedTab;
import React, { MouseEventHandler, useState } from 'react';
import Icon from '../icons';
import './index.less';

const TabItem: React.FC<{
    file: {
        status?: string,
        path: string,
    },
    onPathChange?: MouseEventHandler<HTMLDivElement>,
    currentPath?: string,
}> = ({
    file,
    onPathChange,
    currentPath,
}) => {
    const name = file.path.split('/').slice(-1)[0];
    const fileType = file.path.split('.').slice(-1);
    const active = currentPath === file.path;

    const [showClose, setShowClose] = useState(false);
    const handleOver = () => {
        setShowClose(true);
    }
    const handleLeave = () => {
        setShowClose(false);
    }

    return (
        <div
            onMouseOver={handleOver}
            onMouseLeave={handleLeave}
            key={file.path}
            data-src={file.path}
            className={
                `music-monaco-editor-opened-tab-item ${active ? 'music-monaco-editor-opened-tab-item-focused': ''}`
            }
            onClick={onPathChange}>
            <Icon type={`file_type_${fileType}`} style={{ marginRight: '2px' }} />
            <span style={{ flex: 1, paddingRight: '5px' }}>{name}</span>
            <span
                style={{
                    visibility: (showClose || active) ? 'visible' : 'hidden',
                }}
                className="music-monaco-editor-opened-tab-item-close">
                x
            </span>
        </div>
    )
}

const OpenedTab: React.FC<{
    openedFiles: Array<{
        status?: string,
        path: string,
    }>,
    onPathChange?: MouseEventHandler<HTMLDivElement>,
    currentPath?: string,
}> = ({
    openedFiles,
    onPathChange,
    currentPath,
}) => {
    return (
        <div className="music-monaco-editor-opened-tab">
            {
                openedFiles.map(file => {
                    const name = file.path.split('/').slice(-1)[0];
                    const fileType = file.path.split('.').slice(-1);
                    const active = currentPath === file.path;
                    return (
                        <TabItem
                            file={file}
                            onPathChange={onPathChange}
                            currentPath={currentPath}
                            />
                    )
                })
            }
        </div>
    )
}

export default OpenedTab;
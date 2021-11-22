import React, { MouseEventHandler, useCallback, useState } from 'react';
import Icon from '../icons';
import './index.less';

const TabItem: React.FC<{
    file: {
        status?: string,
        path: string,
    },
    onPathChange?: (key: string) => void,
    currentPath?: string,
    onCloseFile: (key: string) => void,
}> = ({
    file,
    onPathChange,
    currentPath,
    onCloseFile
}) => {
    const name = file.path.split('/').slice(-1)[0];
    const fileType = file.path.split('.').slice(-1);
    const active = currentPath === file.path;
    const handlePathChange = useCallback((e) => {
        const key = e.currentTarget.dataset.src!;
        if (onPathChange) {
            onPathChange(key);
        }
    }, [onPathChange]);

    const [showClose, setShowClose] = useState(false);
    const handleOver = () => {
        setShowClose(true);
    }
    const handleLeave = () => {
        setShowClose(false);
    }

    const handleClose: MouseEventHandler<HTMLSpanElement> = (e) => {
        e.stopPropagation();
        onCloseFile(file.path);
    }

    return (
        <div
            onMouseOver={handleOver}
            onMouseLeave={handleLeave}
            data-src={file.path}
            className={
                `music-monaco-editor-opened-tab-item ${active ? 'music-monaco-editor-opened-tab-item-focused': ''}`
            }
            onClick={handlePathChange}>
            <Icon type={`file_type_${fileType}`} style={{ marginRight: '2px' }} />
            <span style={{ flex: 1, paddingRight: '5px' }}>{name}</span>
            <span
                onClick={handleClose}
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
    onPathChange?: (key: string) => void,
    currentPath?: string,
    onCloseFile: (path: string) => void,
}> = ({
    openedFiles,
    onPathChange,
    currentPath,
    onCloseFile,
}) => {
    return (
        <div className="music-monaco-editor-opened-tab">
            {
                openedFiles.map(file => 
                    <TabItem
                        onCloseFile={onCloseFile}
                        file={file}
                        key={file.path}
                        onPathChange={onPathChange}
                        currentPath={currentPath}
                        />
                )
            }
        </div>
    )
}

export default OpenedTab;
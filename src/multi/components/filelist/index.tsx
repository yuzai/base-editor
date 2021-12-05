import React, { useCallback, useState } from 'react';
import Icon from '../icons';
import './index.less';

const File: React.FC<{
    file: any,
    onPathChange: (key: string) => void,
    directory?: string,
    root: boolean,
    currentPath?: string
}> = ({
    file,
    onPathChange,
    directory = '',
    currentPath = '',
    root
}) => {
    const [showChild, setShowChild] = useState(false);
    const handleClick = useCallback(() => {
        setShowChild(pre => !pre);
    }, []);
    const handlePathChange = useCallback((e) => {
        const key = e.currentTarget.dataset.src!;
        onPathChange(key);
    }, [onPathChange]);
    if (file.name) {
        const fileType = file.name.split('.').slice(-1);
        
        return (
            <div
                data-src={file.path}
                onClick={handlePathChange}
                key={file.path}
                className={`music-monaco-editor-list-file-item-row ${currentPath === file.path ? 'music-monaco-editor-list-file-item-row-focused' : ''}`}>
                <Icon
                    type={`file_type_${fileType}`}
                    style={{
                        marginRight: '5px',
                    }} />
                {file.name}
            </div>
        )
    }
    return (
        <div className="music-monaco-editor-list-file-item">
            {
                directory && (
                    <div onClick={handleClick} className="music-monaco-editor-list-file-item-row">
                        <Icon
                            style={{
                                marginRight: '5px',
                            }}
                            type={showChild ? 'default_folder_opened' : 'default_folder'} />
                        {directory}
                    </div>
                )
            }
            {
                (showChild || root) && (
                    <div style={{paddingLeft: directory ? '5px' : '0'}}>
                        {
                            Object.keys(file).map(item => (
                                <File
                                    currentPath={currentPath}
                                    root={false}
                                    file={file[item]}
                                    onPathChange={onPathChange}
                                    key={item}
                                    directory={item}
                                    />
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

const FileTree: React.FC<{
    filetree: any,
    onPathChange: (key: string) => void,
    title?: string,
    currentPath?: string,
}> = ({
    filetree,
    onPathChange,
    title = 'monaco-base-editor',
    currentPath = '',
}) => {

    return (
        <div className="music-monaco-editor-list-wrapper">
            <div className="music-monaco-editor-list-title">
                {title}
            </div>
            <div className="music-monaco-editor-list-files">
                <File
                    currentPath={currentPath}
                    root
                    file={filetree}
                    onPathChange={onPathChange} />
            </div>
        </div>
    )
};

export default React.memo(FileTree);

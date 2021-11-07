import React, { MouseEventHandler, useCallback, useState } from 'react';
import Icon from '../icons';
import { generateFileTree } from '../../../utils';
import './index.less';

interface fileObj {
    [key: string]: string,
}

const File: React.FC<{
    file: any,
    onPathChange: MouseEventHandler<HTMLDivElement>,
    directory?: string,
    root: boolean,
}> = ({
    file,
    onPathChange,
    directory = '',
    root
}) => {
    const [showChild, setShowChild] = useState(false);
    const handleClick = useCallback(() => {
        setShowChild(pre => !pre);
    }, []);
    if (file.name) {
        return (
            <div data-src={file.path} onClick={onPathChange} key={file.path}>
                {file.name}
            </div>
        )
    }
    return (
        <div className="music-monaco-editor-list">
            <Icon />
            {
                directory && (
                    <div onClick={handleClick} className="music-manaco-editor-tree-icon default_folder-opened">
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
    files: fileObj,
    onPathChange: MouseEventHandler<HTMLParagraphElement>,
    title?: string,
}> = ({
    files,
    onPathChange,
    title = 'editor',
}) => {
    const fileTree = generateFileTree(files);

    return (
        <div className="music-monaco-editor-list">
            <div className="music-monaco-editor-list-title">
                {title}
            </div>
            <div className="music-monaco-editor-list-files">
                <File
                    root
                    file={fileTree}
                    onPathChange={onPathChange} />
            </div>
        </div>
    )
};

export default React.memo(FileTree);
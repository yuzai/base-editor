import React, { useCallback, useState, useMemo, useRef, useEffect, FocusEventHandler } from 'react';
import AddFileIcon from '@components/icons/addfile';
import AddFolderIcon from '@components/icons/addfolder';
import Icon from '@components/icons';
import Arrow from '@components/icons/arrow';
import DeleteIcon from '@components/icons/delete';
import EditIcon from '@components/icons/edit';
import { generateFileTree, addSourceFile, deleteSourceFile, editSourceFileName } from '@utils/index';
import './index.less';

const File: React.FC<{
    file: any,
    onPathChange: (key: string) => void,
    directory?: string,
    root: boolean,
    currentPath?: string,
    onAddFile: (...args: any[]) => void,
    onConfirmAddFile: (...args: any[]) => void,
    onDeleteFile: (...args: any[]) => void,
    onEditFileName: (...args: any[]) => void,
}> = ({
    file,
    onPathChange,
    directory = '',
    currentPath = '',
    root,
    onAddFile,
    onConfirmAddFile,
    onDeleteFile,
    onEditFileName,
}) => {
    const [showChild, setShowChild] = useState(false);
    const [editing, setEditing] = useState(false);
    const nameRef = useRef<HTMLDivElement>(null);
    const handleClick = useCallback(() => {
        setShowChild(pre => !pre);
    }, []);

    const handlePathChange = useCallback((e) => {
        const key = e.currentTarget.dataset.src!;
        onPathChange(key);
    }, [onPathChange]);

    const handleBlur = useCallback((e: any) => {
        const name = nameRef.current?.textContent;
        if (editing) {
            setEditing(false);
            if (file.name !== name) {
                onEditFileName(file.path, name);
            }
        } else {
            onConfirmAddFile({
                ...file,
                name,
            });
        }
    }, [editing, file, onEditFileName, onConfirmAddFile]);

    useEffect(() => {
        if (file._isFile && !file.name) {
            nameRef.current!.focus();
        }
    }, [file]);

    useEffect(() => {
        if (editing) {
            nameRef.current!.textContent = file.name;
            nameRef.current!.focus();
        }
    }, [editing]);

    const keys = useMemo(() => {
        if (file._isFile) return [];
        const childs = file.children;
        const folders = Object.keys(childs).filter(key => !childs[key]._isFile).sort();
        const files = Object.keys(childs).filter(key => childs[key]._isFile).sort();
        return folders.concat(files);
    }, [file]);

    if (file._isFile) {
        let fileType;
        if (file.name && file.name.indexOf('.') !== -1) {
            fileType = `file_type_${file.name.split('.').slice(-1)}`;
        } else {
            fileType = 'default_file';
        }
        
        return (
            <div
                data-src={file.path}
                onClick={handlePathChange}
                key={file.path}
                className={`music-monaco-editor-list-file-item-row ${currentPath === file.path ? 'music-monaco-editor-list-file-item-row-focused' : ''}`}>
                <Icon
                    type={fileType}
                    style={{
                        marginLeft: '14px',
                        marginRight: '5px',
                    }} />
                {
                    (file.name && !editing) ? (
                        <>
                            <span style={{ flex: 1 }}>{file.name}</span>
                            <EditIcon
                                onClick={(e:Event) => {
                                    e.stopPropagation();
                                    setEditing(true);
                                }}
                                className="music-monaco-editor-list-split-icon" />
                            <DeleteIcon
                                onClick={(e:Event) => {
                                    e.stopPropagation();
                                    onDeleteFile(file.path);
                                }}
                                className="music-monaco-editor-list-split-icon" />
                        </>
                    ) : (
                        <div
                            onClick={(e: any) => {
                                e.stopPropagation();
                            }}
                            onBlur={handleBlur}
                            ref={nameRef}
                            className="music-monaco-editor-list-file-item-new"
                            contentEditable />
                    )
                }
            </div>
        )
    }
    return (
        <div className="music-monaco-editor-list-file-item">
            {
                directory && (
                    <div onClick={handleClick} className="music-monaco-editor-list-file-item-row">
                        <Arrow collpase={!showChild} />
                        <Icon
                            style={{
                                marginRight: '5px',
                            }}
                            type={showChild ? 'default_folder_opened' : 'default_folder'} />
                        <span style={{flex: 1}}>{directory}</span>
                        <AddFileIcon
                            onClick={(e:Event) => {
                                e.stopPropagation();
                                setShowChild(true);
                                onAddFile(file.path + '/');
                            }}
                            className="music-monaco-editor-list-split-icon" />
                        {/* <AddFolderIcon
                            className="music-monaco-editor-list-split-icon" /> */}
                    </div>
                )
            }
            {
                (showChild || root) && (
                    <div style={{paddingLeft: directory ? '7px' : '0'}}>
                        {
                            keys.map(item => (
                                <File
                                    onEditFileName={onEditFileName}
                                    onDeleteFile={onDeleteFile}
                                    onConfirmAddFile={onConfirmAddFile}
                                    onAddFile={onAddFile}
                                    currentPath={currentPath}
                                    root={false}
                                    file={file.children[item]}
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
    defaultFiles: any,
    onPathChange: (key: string) => void,
    title?: string,
    currentPath?: string,
    style?: any,
    onAddFile: (...args: any) => void,
    onDeleteFile: (...args: any) => void,
    onEditFileName: (...args: any) => void,
}> = ({
    defaultFiles,
    onPathChange,
    title = 'monaco-base-editor',
    currentPath = '',
    style,
    onAddFile,
    onDeleteFile,
    onEditFileName,
}) => {
    const [collpase, setCollpase] = useState(false);

    const [filetree, setFiletree] = useState(generateFileTree(defaultFiles));

    const addFile = useCallback((path: string) => {
        setFiletree(addSourceFile(filetree, path));
    }, [filetree]);

    const deleteFile = useCallback((path: string) => {
        setFiletree(deleteSourceFile(filetree, path));
        onDeleteFile(path);
    }, [filetree, onDeleteFile]);

    const editFileName = useCallback((path: string, name: string) => {
        setFiletree(editSourceFileName(filetree, path, name));
        onEditFileName(path, name);
    }, [filetree, onEditFileName]);

    const handleConfirmAddFile = useCallback((file: any) => {
        let tree:any = {};
        if (file.name) {
            tree = deleteSourceFile(filetree, file.path);
            tree = addSourceFile(tree, file.path + file.name);
            onAddFile(file.path + file.name);
        } else {
            tree = deleteSourceFile(filetree, file.path);
        }
        setFiletree(tree);
    }, [filetree, onAddFile]);

    const handleCollapse = useCallback(() => {
        setCollpase(pre => !pre);
    }, []);

    console.log(filetree);

    return (
        <div className="music-monaco-editor-list-wrapper" style={style}>
            <div className="music-monaco-editor-list-title">
                {title}
            </div>
            <div className="music-monaco-editor-list-split" onClick={handleCollapse}>
                <Arrow collpase={collpase} />
                <span style={{ flex: 1 }}>Files</span>
                <AddFileIcon
                    onClick={(e:Event) => {
                        e.stopPropagation();
                        addFile('/');
                    }}
                    className="music-monaco-editor-list-split-icon" />
                {/* <AddFolderIcon
                    className="music-monaco-editor-list-split-icon" /> */}
            </div>
            {
                !collpase && (
                <div className="music-monaco-editor-list-files">
                    <File
                        onEditFileName={editFileName}
                        onDeleteFile={deleteFile}
                        onAddFile={addFile}
                        onConfirmAddFile={handleConfirmAddFile}
                        currentPath={currentPath}
                        root
                        file={filetree}
                        onPathChange={onPathChange} />
                </div>
                )
            }
        </div>
    )
};

export default React.memo(FileTree);

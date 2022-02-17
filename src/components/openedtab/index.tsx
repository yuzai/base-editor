import React, {
    MouseEventHandler,
    useCallback,
    useEffect,
    useState,
    useRef
} from 'react';
import Modal from '@components/modal';
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
    rootEl: HTMLElement | null,
    onSaveFile: (path: string) => void,
    onAbortSave: (path: string) => void,
    onCloseOtherFiles: (path: string) => void,
}> = ({
    file,
    onPathChange,
    currentPath,
    onCloseFile,
    rootEl,
    onSaveFile,
    onAbortSave,
    onCloseOtherFiles
}) => {
    const itemRef = useRef<HTMLDivElement | null>(null);
    const name = file.path.split('/').slice(-1)[0];
    let fileType;
        if (file.path && file.path.indexOf('.') !== -1) {
            fileType = `file_type_${file.path.split('.').slice(-1)}`;
        } else {
            fileType = 'default_file';
        }
    const active = currentPath === file.path;
    const handlePathChange = useCallback((e) => {
        const key = e.currentTarget.dataset.src!;
        if (onPathChange) {
            onPathChange(key);
        }
    }, [onPathChange]);

    useEffect(() => {
        if (active) {
            itemRef.current?.scrollIntoView({
                block: 'nearest',
            });
        }
    }, [active]);

    const [hover, setHover] = useState(false);
    const [hoverRight, setHoverRight] = useState(false);
    const handleOver = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement) {
            if (e.target.dataset.name === 'editing') {
                setHoverRight(true);
            } else {
                setHoverRight(false);
            }
        }
        setHover(true);
    }
    const handleLeave = () => {
        setHover(false);
        setHoverRight(false);
    }

    const handleClose: MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
        e.stopPropagation();
        if (file.status === 'editing') {
            setTimeout(() => {
                Modal.confirm({
                    title: '是否要保存对本文件的修改',
                    target: rootEl,
                    okText: '保存',
                    cancelText: '不保存',
                    onCancel: (close: () => void) => {
                        close();
                        onAbortSave(file.path);
                    },
                    onOk: (close: () => void) => {
                        close();
                        onCloseFile(file.path);
                        onSaveFile(file.path);
                    },
                    content: () => (
                        <div>
                            <div>如果不保存，你的更改将丢失</div>
                            <div>当前文件路径: {file.path}</div>
                        </div>
                    ),
                });
            });
        } else {
            onCloseFile(file.path);
        }
    }, [file, onCloseFile, onAbortSave, rootEl, onSaveFile])

    const handleMouseDown = useCallback((e) => {
        if (e.button !== 2) {
            return;
        }
        const position = {
            x: e.clientX,
            y: e.clientY,
        }
        setTimeout(() => {
            Modal.create({
                title: '是否确认删除？',
                // target: rootEl,
                onOk: (close: () => void) => {
                    close();
                },
                content: (close: any) => (
                    <div
                        style={{
                            top: `${position.y}px`,
                            left: `${position.x}px`,
                        }}
                        className="music-monaco-editor-rightclick-panel">
                        <div
                            onClick={(e) => {
                                close();
                                handleClose(e);
                            }}
                            className="music-monaco-editor-rightclick-panel-item">
                            Close
                        </div>
                        <div
                            onClick={() => {
                                close();
                                onCloseOtherFiles(file.path);
                            }}
                            className="music-monaco-editor-rightclick-panel-item">
                            Close others
                        </div>
                        <div
                            onClick={() => {
                                close();
                                onCloseOtherFiles('');
                            }}
                            className="music-monaco-editor-rightclick-panel-item">
                            Close all
                        </div>
                    </div>
                ),
                className: 'music-monaco-editor-modal-rightclick'
            });
        });
    }, [handleClose, onCloseOtherFiles, file.path]);

    let closeVisible = true;
    if (file.status === 'editing' && !hoverRight) {
        closeVisible = false;
    } else if (file.status !== 'editing' && !hover && !active) {
        closeVisible = false;
    }

    return (
        <div
            ref={itemRef}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
            onMouseOver={handleOver}
            onMouseLeave={handleLeave}
            data-src={file.path}
            className={
                `music-monaco-editor-opened-tab-item ${active ? 'music-monaco-editor-opened-tab-item-focused': ''}`
            }
            onClick={handlePathChange}>
            <Icon type={fileType} style={{ marginRight: '2px' }} />
            <span style={{ flex: 1, paddingRight: '5px' }}>{name}</span>
            <span
                data-name="editing"
                className="music-monaco-editor-opened-tab-item-editing"
                style={{
                    visibility: (file.status === 'editing' && !hoverRight) ? 'visible' : 'hidden'
                }} />
            <span
                data-name="editing"
                onClick={handleClose}
                style={{
                    visibility: closeVisible ? 'visible' : 'hidden'
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
    rootEl: HTMLElement | null,
    onSaveFile: (path: string) => void,
    onAbortSave: (path: string) => void,
    onCloseOtherFiles: (path: string) => void,
}> = ({
    openedFiles,
    onPathChange,
    currentPath,
    onCloseFile,
    rootEl,
    onSaveFile,
    onAbortSave,
    onCloseOtherFiles,
}) => {
    return (
        <div className="music-monaco-editor-opened-tab-wrapper">
            <div className="music-monaco-editor-opened-tab">
                {
                    openedFiles.map(file => 
                        <TabItem
                            onSaveFile={onSaveFile}
                            onAbortSave={onAbortSave}
                            rootEl={rootEl}
                            onCloseFile={onCloseFile}
                            file={file}
                            key={file.path}
                            onPathChange={onPathChange}
                            currentPath={currentPath}
                            onCloseOtherFiles={onCloseOtherFiles}
                            />
                    )
                }
            </div>
        </div>
    )
}

export default OpenedTab;
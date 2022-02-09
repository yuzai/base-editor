import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useImperativeHandle,
    useMemo
} from 'react';
import * as monacoType from 'monaco-editor';
import OpenedTab from '@components/openedtab';
import FileList from '@components/filelist';
import Modal from '@components/modal';
import Select from '@components/select';
import Close from '@components/icons/close';
import SettingIcon from '@components/icons/setting';
import Prettier from '@components/prettier';
import { worker, createOrUpdateModel, deleteModel } from '@utils';
import { THEMES } from '@utils/consts';
import { configTheme } from '@utils/initEditor';
export interface filelist {
    [key: string]: string | null,
}
export interface MultiEditorIProps {
    defaultPath?: string,
    // path?: string,
    onPathChange?: (key: string) => void,
    // defaultValue?: string,
    // value?: string,
    onValueChange?: (v: string) => void,
    onFileChange?: (key: string, value: string) => void,
    defaultFiles?: filelist,
    // files?: filelist,
    options: monacoType.editor.IStandaloneEditorConstructionOptions
}

export interface MultiRefType {
    getValue: (path: string) => string | null,
    getAllValue: () => filelist,
    getSupportThemes: () => Array<string>,
    setTheme: (name: string) => void,
}

export const MultiEditorComp = React.forwardRef<MultiRefType, MultiEditorIProps>(({
    defaultPath,
    // path,
    onPathChange,
    // defaultValue,
    // value,
    onValueChange,
    defaultFiles = {},
    // files,
    onFileChange,
    options,
}, ref) => {
    const onPathChangeRef = useRef(onPathChange);
    const onValueChangeRef = useRef(onValueChange);
    const onFileChangeRef = useRef(onFileChange);
    const optionsRef = useRef(options);
    onPathChangeRef.current = onPathChange;
    onValueChangeRef.current = onValueChange;
    onFileChangeRef.current = onFileChange;
    optionsRef.current = options;
    const autoPrettierRef = useRef<boolean>(true);

    const editorNodeRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const prePath = useRef<string | null>(defaultPath || '');
    const filesRef = useRef(defaultFiles);
    const valueLisenerRef = useRef<monacoType.IDisposable>();
    const editorStatesRef = useRef(new Map());

    const [openedFiles, setOpenedFiles] = useState<Array<{
        status?: string,
        path: string,
    }>>(defaultPath ? [{
        path: defaultPath,
    }] : []);

    const [curPath, setCurPath] = useState(defaultPath || '');
    const curPathRef = useRef(defaultPath || '');
    const curValueRef = useRef('');

    const handleFromat = useCallback(() => {
        return editorRef.current?.getAction('editor.action.formatDocument').run();
    }, []);

    const restoreModel = useCallback((path: string) => {
        const editorStates = editorStatesRef.current;
        const model = window.monaco.editor
            .getModels()
            .find(model => model.uri.path === path);
        if (path !== prePath.current && prePath.current) {
            editorStates.set(prePath.current, editorRef.current?.saveViewState());
        }
        if (valueLisenerRef.current && valueLisenerRef.current.dispose) {
            valueLisenerRef.current.dispose();
        }
        if (model && editorRef.current) {
            editorRef.current.setModel(model);
            // 如果path改变，那么恢复上一次的状态
            if (path !== prePath.current) {
                const editorState = editorStates.get(path);
                if (editorState) {
                    editorRef.current?.restoreViewState(editorState);
                }
                // 聚焦editor
                editorRef.current?.focus();
                let timer: any = null;
                valueLisenerRef.current = model.onDidChangeContent(() => {
                    const v = model.getValue();
                    setOpenedFiles((pre) => pre.map(v => {
                        if (v.path === path) {
                            v.status = 'editing';
                        }
                        return v;
                    }));
                    // filesRef.current[path] = v;
                    if (onFileChangeRef.current) {
                        onFileChangeRef.current(path, v);
                    }
                    curValueRef.current = v;
                    if (onValueChangeRef.current) {
                        onValueChangeRef.current(v);
                    }

                    // eslint解析需要消抖，延迟500ms消抖即可
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(() => {
                        timer = null;
                        worker.then(res => res.postMessage({
                            code: model.getValue(),
                            version: model.getVersionId(),
                            path,
                        }));
                    }, 500);
                })
            }
            worker.then(res => res.postMessage({
                code: model.getValue(),
                version: model.getVersionId(),
                path,
            }));
            prePath.current = path;
            return model;
        }
        return false;
    }, []);

    useEffect(() => {
        worker.then(res => res.onmessage = function (event) {
            const { markers, version } = event.data;
            const model = editorRef.current?.getModel();
            if (model && model.getVersionId() === version) {
                window.monaco.editor.setModelMarkers(model, 'eslint', markers);
            }
        });
    }, []);
    
    const openOrFocusPath = useCallback((path: string) => {
        setOpenedFiles(pre => {
            let exist = false;
            pre.forEach(v => {
                if (v.path === path) {
                    exist = true;
                }
            })
            if (exist) {
                return pre;
            } else {
                return [...pre, { path: path }]
            }
        });
        setCurPath(path);
    }, []);

    const handlePathChange = useCallback((path: string) => {
        const model = restoreModel(path);
        if (model) {
            openOrFocusPath(path);
        }
    }, [restoreModel, openOrFocusPath]);

    useEffect(() => {
        // 创建editor 实例
        editorRef.current = window.monaco.editor.create(editorNodeRef.current!, {
            ...optionsRef.current,
            model: null,
        });

        const editorService = (editorRef.current as any)._codeEditorService;
        const openEditorBase = editorService.openCodeEditor.bind(editorService);
        editorService.openCodeEditor = async (input: any, source: any, sideBySide: any) => {
            const result = await openEditorBase(input, source);
            if (result === null) {
                const fullPath = input.resource.path
                source.setModel(window.monaco.editor.getModel(input.resource));
                openOrFocusPath(fullPath);
                source.setSelection(input.options.selection);
                source.revealLine(input.options.selection.startLineNumber);
            }
            return result; // always return the base result
        };

        return () => {
            // 销毁实例
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        }
    }, [openOrFocusPath]);

    const saveFile = useCallback((path: string) => {
        if (autoPrettierRef.current) {
            handleFromat()?.then(() => {
                setOpenedFiles((pre) => pre.map(v => {
                    if (v.path === curPathRef.current) {
                        v.status = 'saved';
                    }
                    return v;
                }));
                filesRef.current[curPathRef.current] = curValueRef.current;
            });
        } else {
            setOpenedFiles((pre) => pre.map(v => {
                if (v.path === curPathRef.current) {
                    v.status = 'saved';
                }
                return v;
            }));
            filesRef.current[curPathRef.current] = curValueRef.current;
        }
    }, []);

    const onCloseFile = useCallback((path: string) => {
        setOpenedFiles((pre) => {
            let targetPath = '';
            if (pre.length) {
                const res =  pre.filter((v, index) => {
                    if (v.path === path) {
                        if (index === 0) {
                            if (pre[index + 1]) {
                                targetPath = pre[index + 1].path;
                            }
                        } else {
                            targetPath = pre[index - 1].path;
                        }
                    }
                    return v.path !== path
                });
                // 目标文件是当前文件，且存在下一激活文件时，执行model及path切换的逻辑
                if (targetPath && curPathRef.current === path) {
                    restoreModel(targetPath);
                    setCurPath(targetPath);
                }
                if (res.length === 0) {
                    restoreModel('');
                    setCurPath('');
                    prePath.current = '';
                }
                return res;
            }
            return pre;
        });

    }, [restoreModel]);

    const abortFileChange = useCallback((path: string) => {
        const value = filesRef.current[path] || '';
        createOrUpdateModel(path, value);
        onCloseFile(path);
    }, [onCloseFile]);

    const dealKey = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        const ctrlKey = e.ctrlKey || e.metaKey;
        const keyCode = e.keyCode;

        if (ctrlKey && keyCode === 83) {
            e.preventDefault();
            saveFile(curPathRef.current);
        }
    }, [handleFromat, saveFile]);

    useEffect(() => {
        // 初始化创建各个文件model
        Object.keys(filesRef.current).forEach(key => {
            const value = filesRef.current[key];
            if (typeof value === 'string') {
                createOrUpdateModel(key, value);
            }
        });
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            if (options.theme) {
                configTheme(options.theme);
            }
            editorRef.current.updateOptions(options);
        }
    }, [options]);

    useEffect(() => {
        if (onPathChangeRef.current && curPath) {
            onPathChangeRef.current(curPath);
        }
        curPathRef.current = curPath;
    }, [curPath]);

    useImperativeHandle(ref, () => ({
        getValue: (path: string) => filesRef.current[path],
        getAllValue: () => filesRef.current,
        getSupportThemes: () => THEMES,
        setTheme: (name) => configTheme(name),
    }));

    const addFile = useCallback((path: string, value?: string) => {
        createOrUpdateModel(path, value || '');
        filesRef.current[path] = value || '';
        // 神奇的延时，此处不加延时，monaco会抛错
        setTimeout(() => {
            // 自动打开新建的文件
            handlePathChange(path);
        }, 50);
    }, [handlePathChange]);

    const deleteFile = useCallback((path: string) => {
        deleteModel(path);
        delete filesRef.current[path];
        onCloseFile(path);
    }, [onCloseFile]);

    const editFileName = useCallback((path: string, name: string) => {
        const value = filesRef.current[path] || '';
        // 神奇的延时，此处不加延时，monaco会抛错
        setTimeout(() => {
            deleteFile(path);
            // TODO:使用正则替换，减少开销
            const newPath = path.split('/').slice(0, -1).concat(name).join('/');
            addFile(newPath, value);
        }, 50);
    }, [deleteFile]);

    const addFolder = useCallback((path: string) => {
        let hasChild = false;
        Object.keys(filesRef.current).forEach(p => {
            if (p.startsWith(path + '/')) {
                hasChild = true;
            }
        });
        if (!hasChild) {
            filesRef.current[path] = null;
        }
    }, []);

    const deleteFolder = useCallback((path: string) => {
        // 删除目录引用
        delete filesRef.current[path];
        // 删除子路径下的子文件和文件夹
        Object.keys(filesRef.current).forEach(p => {
            if (p.startsWith(path + '/')) {
                const value = filesRef.current[p];
                if (typeof value === 'string') {
                    deleteFile(p);
                }
            }
        });
    }, [deleteFile]);

    const editFolderName = useCallback((path: string, name: string) => {
        const paths = (path || '/').slice(1).split('/');
        const newPath =  '/' + paths.slice(0, -1).concat(name).join('/');
        // 删除文件夹引用
        delete filesRef.current[path];
        // 新建文件夹引用
        addFolder(newPath);
        // 删除子路径下的子文件和文件夹
        Object.keys(filesRef.current).forEach(p => {
            if (p.startsWith(path + '/')) {
                const value = filesRef.current[p];
                if (typeof value === 'string') {
                    setTimeout(() => {
                         // 子文件需要删除原model
                        deleteModel(p);
                        // 重新创建新model
                        const finalPath = p.replace(path + '/', newPath + '/');
                        createOrUpdateModel(finalPath, value || '');
                        filesRef.current[finalPath] = value || '';
                    }, 50);
                }
                delete filesRef.current[p];
            }
        });
        // 对已打开的涉事文件进行路径替换处理
        setOpenedFiles((pre) => pre.map(v => {
            if (v.path.startsWith(path + '/')) {
                v.path = v.path.replace(path + '/', newPath + '/');
            }
            return v;
        }));
        // 如果涉及当前激活的model，则需要重新打开
        if (curPathRef.current.startsWith(path + '/')) {
            setTimeout(() => {
                handlePathChange(curPathRef.current.replace(path + '/', newPath + '/'));
            }, 50);
        }
    }, [handlePathChange, addFolder]);

    const [filelistWidth, setFilelistWidth] = useState(180);

    const dragStartRef = useRef<{
        pageX: number,
        width: number,
        start: boolean,
    }>({
        pageX: 0,
        width: 0,
        start: false,
    });
    const handleMoveStart = useCallback((e) => {
        dragStartRef.current = {
            pageX: e.pageX,
            width: filelistWidth,
            start: true
        };
    }, [filelistWidth]);

    const handleMove = useCallback((e) => {
        if (dragStartRef.current.start) {
            setFilelistWidth(dragStartRef.current.width + (e.pageX - dragStartRef.current.pageX));
        }
    }, []);

    const handleMoveEnd = useCallback((e) => {
        dragStartRef.current = {
            pageX: e.pageX,
            width: 0,
            start: false,
        };
    }, []);

    const rootRef = useRef(null);

    const [settingVisible, setSettingVisible] = useState(false);

    const handleSetAutoPrettier = useCallback((e) => {
        autoPrettierRef.current = e.target.checked;
    }, []);

    const styles = useMemo(() => ({
        width: `${filelistWidth}px`,
    }), [filelistWidth]);

    return (
        <div
            ref={rootRef}
            id="music-monaco-editor-root"
            tabIndex={1}
            onKeyDown={dealKey}
            onMouseMove={handleMove}
            onMouseUp={handleMoveEnd}
            className="music-monaco-editor">
            <FileList
                onEditFileName={editFileName}
                onDeleteFile={deleteFile}
                onAddFile={addFile}
                onAddFolder={addFolder}
                onDeleteFolder={deleteFolder}
                onEditFolderName={editFolderName}
                style={styles}
                title="web editor"
                currentPath={curPath}
                defaultFiles={defaultFiles}
                onPathChange={handlePathChange} />
            <div
                onMouseDown={handleMoveStart}
                className="music-monaco-editor-drag" />
            <div className="music-monaco-editor-area">
                <OpenedTab
                    onSaveFile={saveFile}
                    onAbortSave={abortFileChange}
                    rootEl={rootRef.current}
                    currentPath={curPath}
                    openedFiles={openedFiles}
                    onCloseFile={onCloseFile}
                    onPathChange={handlePathChange} />
                <div
                    ref={editorNodeRef}
                    style={{ flex: 1, width: '100%' }} />
                {
                    openedFiles.length === 0 && (
                        <div className="music-monaco-editor-area-empty">
                            <img
                                src="//p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/5759801316/fb85/e193/a256/03a81ea60cf94212bbc814f2c82b6940.png"
                                className="music-monaco-editor-area-empty-icon" />
                            <div>web editor</div>
                        </div>
                    )
                }
            </div>
            <div
                className="music-monaco-editor-setting-button"
                onClick={() => setSettingVisible(true) }>
                <SettingIcon
                    style={{
                        width: '20px',
                        height: '20px',
                    }} />
            </div>
            <Prettier
                onClick={handleFromat}
                className="music-monaco-editor-prettier" />
            <Modal
                destroyOnClose
                onClose={() => { setSettingVisible(false) }}
                visible={settingVisible}
                target={rootRef.current}>
                <div className="music-monaco-editor-setting">
                    <div className="music-monaco-editor-setting-header">
                        设置
                        <div
                            onClick={() => setSettingVisible(false) }
                            className="music-monaco-editor-setting-header-close">
                            <Close style={{
                                width: '12px',
                                height: '12px'
                            }} />
                        </div>
                    </div>
                    <div className="music-monaco-editor-setting-content">
                        <div className="music-monaco-editor-input-row">
                            <div className="music-monaco-editor-input-name">
                                prettier
                            </div>
                            <div className="music-monaco-editor-input-value">
                                <input
                                    defaultChecked={autoPrettierRef.current}
                                    type="checkbox"
                                    onChange={handleSetAutoPrettier}/>
                                <label>prettier on save</label>
                            </div>
                        </div>
                        <div className="music-monaco-editor-input-row">
                            <div className="music-monaco-editor-input-name">
                                主题选择
                            </div>
                            <div className="music-monaco-editor-input-value">
                                <Select defaultValue="OneDarkPro" onChange={(v) => configTheme(v.value)}>
                                    {
                                        THEMES.map(theme => (
                                            <Select.Menu label={theme} value={theme} key={theme} />
                                        ))
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
});

export default MultiEditorComp;

MultiEditorComp.displayName = 'MultiEditorComp';
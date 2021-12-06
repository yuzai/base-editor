// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import * as monacoType from 'monaco-editor';
import OpenedTab from './components/openedtab';
import FileList from './components/filelist';
import { generateFileTree } from '../utils';

import './Editor.less';

export interface filelist {
    [key: string]: string,
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
    test: () => void,
    getValue: (path: string) => string,
    getAllValue: () => filelist,
}

// 初始化各个文件
function initializeFile(path: string, value: string) {
    // model 是否存在
    let model = monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (model) {
        if (model.getValue() !== value) {
            model.pushEditOperations(
                [],
                [
                    {
                        range: model?.getFullModelRange(),
                        text: value,
                    },
                ],
                () => [],
            );
        }
    } else if (path) {
        const type = path.split('.').slice(-1)[0];
        const config: {
            [key: string]: string
        } = {
            'js': 'javascript',
            'ts': 'typescript',
            'less': 'less',
            'jsx': 'javascript',
            'tsx': 'typescript',
        }
        model = monaco.editor.createModel(
            value,
            config[type] || type,
            new monaco.Uri().with({ path })
        );
    }
}

// TODO:删除model

// TODO:重命名model

export const MultiEditor = React.forwardRef<MultiRefType, MultiEditorIProps>(({
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

    const editorNodeRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const prePath = useRef<string | null>(defaultPath || '');
    const filesRef = useRef(defaultFiles);
    const [filetree] = useState(generateFileTree(defaultFiles));
    const valueLisenerRef = useRef<monaco.IDisposable>();
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

    const restoreModel = useCallback((path: string) => {
        const editorStates = editorStatesRef.current;
        const model = monaco.editor
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
                valueLisenerRef.current = model.onDidChangeContent(() => {
                    const v = model.getValue();
                    setOpenedFiles((pre) => pre.map(v => {
                        if (v.path === path) {
                            v.status = 'editing';
                        }
                        return v;
                    }));
                    if (onFileChangeRef.current) {
                        onFileChangeRef.current(path, v);
                    }
                    curValueRef.current = v;
                    if (onValueChangeRef.current) {
                        onValueChangeRef.current(v);
                    }
                })
            }
            prePath.current = path;
            return model;
        }
        return false;
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
        editorRef.current = monaco.editor.create(editorNodeRef.current!, optionsRef.current);

        const editorService = (editorRef.current as any)._codeEditorService;
        const openEditorBase = editorService.openCodeEditor.bind(editorService);
        editorService.openCodeEditor = async (input: any, source: any, sideBySide: any) => {
            console.log(input, source, sideBySide);
            const result = await openEditorBase(input, source);
            if (result === null) {
                const fullPath = input.resource.path
                source.setModel(monaco.editor.getModel(input.resource));
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

    const dealKey = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        const ctrlKey = e.ctrlKey || e.metaKey;
        const keyCode = e.keyCode;

        if (ctrlKey && keyCode === 83) {
            e.preventDefault();
            setOpenedFiles((pre) => pre.map(v => {
                if (v.path === curPathRef.current) {
                    v.status = 'saved';
                }
                return v;
            }));
            filesRef.current[curPathRef.current] = curValueRef.current;
        }
    }, []);

    useEffect(() => {
        // 初始化创建各个文件model
        Object.keys(filesRef.current).forEach(key => initializeFile(key, filesRef.current[key]));
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions(options);
        }
    }, [options]);

    useEffect(() => {
        if (onPathChangeRef.current && curPath) {
            onPathChangeRef.current(curPath);
        }
        curPathRef.current = curPath;
    }, [curPath]);

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
                if (targetPath) {
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

    useImperativeHandle(ref, () => ({
        test: () => console.log('test'),
        getValue: (path: string) => filesRef.current[path],
        getAllValue: () => filesRef.current,
    }));

    return (
        <div
            tabIndex={1}
            onKeyDown={dealKey}
            className="music-monaco-editor">
            <FileList
                title="music web editor"
                currentPath={curPath}
                filetree={filetree}
                onPathChange={handlePathChange} />
            <div className="music-monaco-editor-area">
                <OpenedTab
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
                            <div>music web editor</div>
                        </div>
                    )
                }
            </div>
        </div>
    )
});

export default MultiEditor;

MultiEditor.displayName = 'MultiEditor';
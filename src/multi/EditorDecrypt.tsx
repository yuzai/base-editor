/*
* 暂不支持受控，等有场景再支持
*/
import React, { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';
// @ts-ignore
// import { SimpleEditorModelResolverService } from 'monaco-editor/esm/vs/editor/standalone/browser/simpleServices';
import OpenedTab from './components/openedtab';
import FileList from './components/filelist';
import './Editor.less';

// SimpleEditorModelResolverService.prototype.findModel = function(editor: any, resource: any) {
//     return monaco.editor.getModels().find(model => model.uri.toString() === resource.toString());
// };

export interface filelist {
    [key: string]: string,
}

export interface MultiEditorIProps {
    defaultPath?: string,
    // path?: string,
    onPathChange?: (key: string, value: string) => void,
    // defaultValue?: string,
    // value?: string,
    onValueChange?: (v: string) => void,
    onFileChange?: (key: string, value: string) => void,
    defaultFiles?: filelist,
    // files?: filelist,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}

export interface MultiRefType {
    test: () => void,
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
                        range: model!.getFullModelRange(),
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

// 存储各个文件的状态
const editorStates = new Map();

// TODO:删除model

// TODO:重命名model

export const MultiEditor= React.forwardRef<MultiRefType, MultiEditorIProps>(({
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
    const editorNodeRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const prePath = useRef<string | null>(defaultPath || '');
    const [openedFiles, setOpenedFiles] = useState<Array<{
        status?: string,
        path: string,
    }>>(defaultPath ? [{
        path: defaultPath,
    }] : []);

    const [innerFiles, setInnerFiles] = useState(defaultFiles);
    const [innerPath, setInnerPath] = useState(defaultPath || '');
    const [innerValue, setInnerValue] = useState(defaultFiles[defaultPath || ''] || '');

    const handlePathChange = useCallback((key: string) => {
        setInnerPath(key);
        if (!key) return;
        setInnerValue(innerFiles[key]);
        if (onPathChange) {
            onPathChange(key, innerFiles[key]);
        }
        setOpenedFiles(pre => {
            let exist = false;
            pre.forEach(v => {
                if (v.path === key) {
                    exist = true;
                }
            })
            if (exist) {
                return pre;
            } else {
                return [...pre, { path: key }]
            }
        });
    }, [innerFiles, onPathChange]);

    useEffect(() => {
        // 创建editor 实例
        editorRef.current = monaco.editor.create(editorNodeRef.current!, options);

        const editorService = (editorRef.current as any)._codeEditorService;
        const openEditorBase = editorService.openCodeEditor.bind(editorService);
        editorService.openCodeEditor = async (input: any, source: any, sideBySide: any) => {
            console.log(input, source, sideBySide);
            const result = await openEditorBase(input, source);
            if (result === null) {
                const fullPath = input.resource.path
                const lineNumber = input.options.selection.startLineNumber

                alert("file is at " + fullPath + ":" + lineNumber );
                source.setModel(monaco.editor.getModel(input.resource));
                // // this.props.onOpenPath(resource.path);
                // // Move cursor to the desired position
                // source.setSelection(input.options.selection);
                // // Scroll the editor to bring the desired line into focus
                // source.revealLine(input.options.selection.startLineNumber);
                // return {
                //     getControl: () => source,
                // };
            }
            return result; // always return the base result
        };


        return () => {
            // 销毁实例
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        }
    }, []);

    useEffect(() => {
        function dealKey(e: Event) {
            console.log(e);
        }
        document.addEventListener('keydown', dealKey);
        return () => document.removeEventListener('keydown', dealKey);
    }, []);

    useEffect(() => {
        // 创建各个文件model
        Object.keys(innerFiles).forEach(key => initializeFile(key, innerFiles[key]));
    }, [innerFiles]);

    useEffect(() => {
        // 先创建 or 更新model内容
        initializeFile(innerPath, innerValue);
        // path切换，存储上一个path编辑状态
        if (innerPath !== prePath.current) {
            editorStates.set(prePath.current, editorRef.current?.saveViewState());
        }
        // 获取当前model
        const model = monaco.editor
            .getModels()
            .find(model => model.uri.path === innerPath);
        let sub: monaco.IDisposable;
        if (model && editorRef.current) {
            // 设置editor实例使用当前model
            editorRef.current.setModel(model);
            // 如果path改变，那么恢复上一次的状态
            if (innerPath !== prePath.current) {
                const editorState = editorStates.get(innerPath);
                if (editorState) {
                    editorRef.current?.restoreViewState(editorState);
                }
                // 聚焦editor
                editorRef.current?.focus();
            }
            // 监听editor内容改变
            sub = model.onDidChangeContent(() => {
                const v = model.getValue();    
                setInnerValue(v);
                setInnerFiles(pre => ({
                    ...pre,
                    [innerPath]: v,
                }))
                if (onValueChange) {
                    onValueChange(v);
                }
                if (onFileChange) {
                    onFileChange(innerPath, v);
                }
            })
        }
        // 更新上一次的path
        prePath.current = innerPath;
        return () => {
            if (sub && sub.dispose) {
                sub.dispose();
            }
        }
    }, [innerPath, innerValue]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions(options);
        }
    }, [options]);

    const onCloseFile = useCallback((path: string) => {
        let targetPath = '';
        setOpenedFiles((pre) => {
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

                if (targetPath && innerPath === path) {
                    handlePathChange(targetPath);
                }
                if (res.length === 0) {
                    handlePathChange('');
                }
                return res;
            }
            return pre;
        });
    }, [innerPath, handlePathChange]);

    useImperativeHandle(ref, () => ({
        test: () => console.log('test'),
    }));

    return (
        <div className="music-monaco-editor">
            <FileList
                title="music web editor"
                currentPath={innerPath}
                files={innerFiles}
                onPathChange={handlePathChange} />
            <div className="music-monaco-editor-area">
                <OpenedTab
                    currentPath={innerPath}
                    openedFiles={openedFiles}
                    onCloseFile={onCloseFile}
                    onPathChange={handlePathChange} />
                <div ref={editorNodeRef} style={{ flex: 1, width: '100%' }} />
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
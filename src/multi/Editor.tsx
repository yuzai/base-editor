/*
* 暂不支持受控，等有场景再支持
*/
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import OpenedTab from './components/openedtab';
import FileList from './components/filelist';
import './Editor.less';

interface filelist {
    [key: string]: string,
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
    } else {
        const type = path.split('.').slice(-1)[0];
        const config: {
            [key: string]: string
        } = {
            'js': 'javascript',
            'ts': 'typescript',
            'less': 'less',
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

const Editor: React.FC<{
    defaultPath?: string,
    // path?: string,
    // onPathChange?: (key: string, value: string) => void,
    defaultValue?: string,
    // value?: string,
    // onValueChange?: (v: string) => void,
    files: filelist,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}> = ({
    defaultPath,
    // path,
    // onPathChange,
    defaultValue,
    // value,
    // onValueChange,
    files,
    options,
}) => {
    const editorNodeRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const prePath = useRef<string | null>(defaultPath || '');
    const [openedFiles, setOpenedFiles] = useState<Array<{
        status?: string,
        path: string,
    }>>(defaultPath ? [{
        path: defaultPath,
    }] : []);

    const [innerPath, setInnerPath] = useState(defaultPath || '');
    const [innerValue, setInnerValue] = useState(defaultValue || '');

    useEffect(() => {
        // 创建editor 实例
        editorRef.current = monaco.editor.create(editorNodeRef.current!, options);

        return () => {
            // 销毁实例
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        }
    }, []);

    useEffect(() => {
        // 创建各个文件model
        Object.keys(files).forEach(key => initializeFile(key, files[key]));
    }, [files]);

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

    const handlePathChange = useCallback((e) => {
        const key = e.currentTarget.dataset.src!;
        setInnerPath(key);
        setInnerValue(files[key]);
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
    }, [files]);

    const onCloseFile = useCallback((path: string) => {
        setOpenedFiles(pre => pre.filter(v => v.path !== path));
    }, []);

    return (
        <div className="music-monaco-editor">
            <FileList
                currentPath={innerPath}
                files={files}
                onPathChange={handlePathChange} />
            <div className="music-monaco-editor-area">
                <OpenedTab
                    currentPath={innerPath}
                    openedFiles={openedFiles}
                    onCloseFile={onCloseFile}
                    onPathChange={handlePathChange} />
                <div ref={editorNodeRef} style={{ flex: 1, width: '100%' }}/>
            </div>
        </div>
    )
};

export default Editor;
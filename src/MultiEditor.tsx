import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface fileObj {
    [key: string]: string,
}


// 初始化各个文件
function initializeFile(path: string, value: string) {
    // model 是否存在
    let model = monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (model) {
        // 存在，则比较value是否不同
        if (model.getValue() !== value) {
            // 不同，则更新
            // 采用这种方法才能保留 undo/redo
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
        // 否则，创建新的model
        model = monaco.editor.createModel(
            value,
            // TODO:根据输入文件后缀选择语言
            'javascript',
            new monaco.Uri().with({ path })
        );
    }
}

const Editor: React.FC<{
    path: string,
    files: fileObj,
    value: string,
    onValueChange: (v: string) => void,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}> = ({
    path,
    files,
    value,
    onValueChange,
    options
}) => {
    const editorNodeRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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
        initializeFile(path, value);
        // 获取当前model
        const model = monaco.editor
            .getModels()
            .find(model => model.uri.path === path);
        let sub: monaco.IDisposable;
        if (model && editorRef.current) {
            // 设置editor实例使用当前model
            editorRef.current.setModel(model);
            // 监听editor内容改变
            sub = editorRef.current.getModel()!.onDidChangeContent(() => {
                const v = editorRef.current!.getModel()!.getValue();    
                // 受控        
                onValueChange(v);
            })
        }
        return () => {
            if (sub.dispose) {
                // 销毁监听
                sub.dispose();
            }
        }
    }, [path, value]);

    useEffect(() => {
        if (editorRef.current) {
            // 同步editor options改变
            editorRef.current.updateOptions(options);
        }
    }, [options]);

    return (
        <div ref={editorNodeRef} style={{ width: '800px', height: '600px' }} />
    )
};

export default Editor;
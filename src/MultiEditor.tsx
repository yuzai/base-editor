import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface fileObj {
    [key: string]: string,
}

function initializeFile(path: string, value: string) {
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
        model = monaco.editor.createModel(
            value,
            'javascript',
            new monaco.Uri().with({ path })
        );
    }
}

const Editor: React.FC<{
    path: string,
    files: fileObj,
    language: string,
    value: string,
    onValueChange: (v: string) => void,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}> = ({
    path,
    files,
    value,
    language,
    onValueChange,
    options
}) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const editorNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        editorRef.current = monaco.editor.create(editorNodeRef.current!, options);

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        }
    }, []);

    useEffect(() => {
        Object.keys(files).forEach(key => initializeFile(key, files[key]));
    }, [files]);

    useEffect(() => {
        initializeFile(path, value);
        const model = monaco.editor
            .getModels()
            .find(model => model.uri.path === path);
        let sub: monaco.IDisposable;
        if (model && editorRef.current) {
            editorRef.current.setModel(model);
            sub = editorRef.current.getModel()!.onDidChangeContent(() => {
                const v = editorRef.current!.getModel()!.getValue();            
                onValueChange(v);
            })
        }
        return () => {
            if (sub.dispose) {
                sub.dispose();
            }
        }
    }, [path, value]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions(options);
        }
    }, [options]);

    return (
        <div ref={editorNodeRef} style={{ width: '800px', height: '600px' }} />
    )
};

export default Editor;
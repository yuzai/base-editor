import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

const Editor: React.FC<{
    path: string,
    value: string,
    language: string,
    onValueChange: (v: string) => void,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}> = ({
    path,
    value,
    language,
    onValueChange,
    options
}) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const editorNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        editorRef.current = monaco.editor.create(editorNodeRef.current!, options);
        const model = monaco.editor.createModel(value, language);
        editorRef.current.setModel(model);

        const sub = model.onDidChangeContent(() => {
            onValueChange(model.getValue());
        });

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
            sub.dispose();
        }
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions(options);
        }
    }, [options]);

    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (value !== model?.getValue()) {
                model!.pushEditOperations(
                    [],
                    [
                        {
                            range: model!.getFullModelRange(),
                            text: value,
                        },
                    ],
                    () => null
                );
            }
        }
    }, [value]);

    return (
        <div ref={editorNodeRef} style={{ width: '800px', height: '600px' }} />
    )
};

export default Editor;
import React from 'react';
import * as monaco from 'monaco-editor';
declare const Editor: React.FC<{
    value: string;
    language: string;
    onValueChange: (v: string) => void;
    options: monaco.editor.IStandaloneEditorConstructionOptions;
}>;
export default Editor;

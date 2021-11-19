import React from 'react';
import * as monaco from 'monaco-editor';
export interface EditorIProps {
    defaultValue?: string;
    value?: string;
    language?: string;
    onValueChange?: (v: string) => void;
    options?: monaco.editor.IStandaloneEditorConstructionOptions;
}
export declare const Editor: React.FC<EditorIProps>;
export default Editor;

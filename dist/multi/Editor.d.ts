import React from 'react';
import * as monacoType from 'monaco-editor';
export interface filelist {
    [key: string]: string;
}
export interface MultiEditorIProps {
    defaultPath?: string;
    onPathChange?: (key: string) => void;
    onValueChange?: (v: string) => void;
    onFileChange?: (key: string, value: string) => void;
    defaultFiles?: filelist;
    options: monacoType.editor.IStandaloneEditorConstructionOptions;
}
export interface MultiRefType {
    getValue: (path: string) => string;
    getAllValue: () => filelist;
    getSupportThemes: () => Array<string>;
    setTheme: (name: string) => void;
}
export declare const MultiEditorComp: React.ForwardRefExoticComponent<MultiEditorIProps & React.RefAttributes<MultiRefType>>;
export default MultiEditorComp;

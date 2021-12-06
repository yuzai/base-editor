import React from 'react';
import * as monacoType from 'monaco-editor';
import './Editor.less';
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
    test: () => void;
    getValue: (path: string) => string;
    getAllValue: () => filelist;
}
export declare const MultiEditor: React.ForwardRefExoticComponent<MultiEditorIProps & React.RefAttributes<MultiRefType>>;
export default MultiEditor;

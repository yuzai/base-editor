import React from 'react';
import * as monaco from 'monaco-editor';
import './Editor.less';
export interface filelist {
    [key: string]: string;
}
export interface MultiEditorIProps {
    defaultPath?: string;
    onPathChange?: (key: string, value: string) => void;
    onValueChange?: (v: string) => void;
    onFileChange?: (key: string, value: string) => void;
    defaultFiles?: filelist;
    files?: filelist;
    options: monaco.editor.IStandaloneEditorConstructionOptions;
}
export interface MultiRefType {
    test: () => void;
}
export declare const MultiEditor: React.ForwardRefExoticComponent<MultiEditorIProps & React.RefAttributes<MultiRefType>>;
export default MultiEditor;

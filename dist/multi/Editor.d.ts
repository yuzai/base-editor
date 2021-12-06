import React from 'react';
import * as monacoType from 'monaco-editor';
import './Editor.less';
declare global {
    interface Window {
        monaco: typeof monacoType;
    }
}
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
export declare const MultiEditorComp: React.ForwardRefExoticComponent<MultiEditorIProps & React.RefAttributes<MultiRefType>>;
export default MultiEditorComp;

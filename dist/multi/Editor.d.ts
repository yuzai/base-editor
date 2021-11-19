import React from 'react';
import * as monaco from 'monaco-editor';
import './Editor.less';
interface filelist {
    [key: string]: string;
}
declare const Editor: React.FC<{
    defaultPath?: string;
    onPathChange?: (key: string, value: string) => void;
    onValueChange?: (v: string) => void;
    onFileChange?: (key: string, value: string) => void;
    defaultFiles?: filelist;
    files?: filelist;
    options: monaco.editor.IStandaloneEditorConstructionOptions;
}>;
export default Editor;

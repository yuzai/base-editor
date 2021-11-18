import React from 'react';
import * as monaco from 'monaco-editor';
import './Editor.less';
interface filelist {
    [key: string]: string;
}
declare const Editor: React.FC<{
    path: string;
    files: filelist;
    value: string;
    onValueChange: (v: string) => void;
    onPathChange: (key: string, value: string) => void;
    options: monaco.editor.IStandaloneEditorConstructionOptions;
}>;
export default Editor;

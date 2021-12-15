// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Editor, { MultiEditorIProps, MultiRefType } from './Editor';
import './index.less';

export const MultiEditor = React.forwardRef<MultiRefType, MultiEditorIProps>((props, ref) => {
    const [, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(pre => pre + 1);
            if (window.monaco) {
                clearInterval(interval);
            }
        }, 100);
        return () => {
            clearInterval(interval);
        }
    }, []);

    if (window.monaco) {
        return (
            <Editor {...props} ref={ref} />
        )
    }
    return (
        <div
            className="music-monaco-editor-loading">
            <img
                className="music-monaco-editor-loading-icon"
                src="https://p6.music.126.net/obj/wo3DlcOGw6DClTvDisK1/9879093207/2dbb/873a/9e97/e817279537a0417d042f62fbb1b99eea.gif" />
        </div>
    );
});

MultiEditor.displayName = 'MultiEditorEntry';

export default MultiEditor;


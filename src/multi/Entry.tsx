// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Editor, { MultiEditorIProps, MultiRefType } from './Editor';

export const Entry = React.forwardRef<MultiRefType, MultiEditorIProps>((props, ref) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(pre => pre + 1);
            if (window.monaco) {
                clearInterval(interval);
            }
        }, 100);
    }, []);
    if (window.monaco) {
        return <Editor {...props} ref={ref} />;
    }
    return (<div>loading</div>);
});

Entry.displayName = 'MultiEditorEntry';

export default Entry;


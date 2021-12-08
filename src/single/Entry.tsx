// @ts-nocheck
import React, { useEffect, useState } from 'react';
import EditorComp from './Editor';

export const Editor = (props, ref) => {
    const [, setCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(pre => pre + 1);
            if (window.monaco) {
                clearInterval(interval);
            }
        }, 100);
    }, []);
    if (window.monaco) {
        return <EditorComp {...props} ref={ref} />;
    }
    return (<div>loading</div>);
};

export default React.forwardRef(Editor);


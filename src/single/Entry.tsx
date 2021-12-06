// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Editor from './Editor';

export const Editor = (props, ref) => {
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
};

export default React.forwardRef(Editor);


// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Editor from './Editor';

export const Entry = (props) => {
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
        return <Editor {...props} />;
    }
    return (<div>loading</div>);
};

export default Entry;


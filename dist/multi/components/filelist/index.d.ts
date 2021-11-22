import React from 'react';
import './index.less';
interface filelist {
    [key: string]: string;
}
declare const _default: React.NamedExoticComponent<{
    files: filelist;
    onPathChange: (key: string) => void;
    title?: string | undefined;
    currentPath?: string | undefined;
}>;
export default _default;

import React from 'react';
import './index.less';

const Icon: React.FC<{
    type?: string,
}> = ({
    type = 'default_file',
}) => {
    return (<img src={`./icons/${type}.svg`} className="music-monaco-icons"/>)
}

export default Icon;


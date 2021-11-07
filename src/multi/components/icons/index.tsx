import React from 'react';
import './index.less';

const fileTypeMap = (fileType: string): string => {
    const type = fileType.split('_').slice(-1)[0];
    const config:{
        [index: string]: string,
    } = {
        ts: 'typescript',
        js: 'js',
        tsx: 'reactts',
        jsx: 'reactjsx',
    }
    return config[type] ? `file_type_${config[type]}` : fileType;
}

const Icon: React.FC<{
    type?: string,
    style?: React.CSSProperties,
    className?: string,
}> = ({
    type = 'default_file',
    style = {},
    className = '',
}) => {
    return (<img
            style={style}
            src={`./icons/${fileTypeMap(type)}.svg`}
            className={`music-monaco-icons ${className}`}/>)
}

export default Icon;


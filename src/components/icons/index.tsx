import React, { useState } from 'react';
import { ASSETSPATH } from '@utils/consts';
import './index.less';

const fileTypeMap = (fileType: string): string => {
    const type = fileType.split('_').slice(-1)[0];
    const config:{
        [index: string]: string,
    } = {
        ts: 'typescript',
        js: 'js',
        tsx: 'reactts',
        jsx: 'reactjs',
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
    const [src, setSrc] = useState(`${ASSETSPATH}icons/${fileTypeMap(type)}.svg`);
    const handleError = (e: any) => {
        setSrc(`${ASSETSPATH}icons/default_file.svg`);
    }

    return (
        <img
            onError={handleError}
            style={style}
            src={src}
            className={`music-monaco-icons ${className}`}/>
    )
}

export default Icon;


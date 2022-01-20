import React, { useState } from 'react';
import Arrow from '../icons/arrow';
import './index.less';

const Select: React.FC<{
    defaultValue?: string,
    value?: string,
    onChange?: (v: string) => void,
    options: Array<string>,
}> = ({
    defaultValue,
    value,
    options,
    onChange,
}) => {
    const [innerValue, setInnerValue] = useState(defaultValue || '');
    const [showOptions, setShowOptions] = useState(false);

    const finalValue = value === undefined ? innerValue : value;
    return (
        <div
            className="music-monaco-editor-select">
            <div className="music-monaco-editor-select-content" onClick={() => setShowOptions(pre => !pre)}>
                {finalValue}
                <div className="music-monaco-editor-select-content-arrow">
                    <Arrow collpase={!showOptions} />
                </div>
            </div>
            {
                showOptions && <div className="music-monaco-editor-select-items">
                    {
                        options.map((option: string, index: number) => (
                            <div
                                onClick={() => {
                                    setInnerValue(option);
                                    setShowOptions(false);
                                    if (onChange) {
                                        onChange(option);
                                    }
                                }}
                                key={index}
                                className="music-monaco-editor-select-item">
                                {option}
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default Select;
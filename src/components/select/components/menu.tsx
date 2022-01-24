import React, { useState, useEffect } from "react";

const Menu: React.FC<{
    label?: string,
    value: any,
    className?: string,
    handleSelect?: (obj: { value: any, label: string }) => void,
    defaultValue?: string | number,
}> = ({
    label = '',
    value,
    className,
    defaultValue = '',
    handleSelect = () => ({}),
}) => {
    const [ selected, setSelected ] = useState(false);

    useEffect(() => {
        if (defaultValue === value) {
            setSelected(true);
        }
    }, [value, defaultValue]);

    return (
        <div
            onClick={() => {
                handleSelect({value, label});
            }}
            className={`music-monaco-editor-select-item ${selected ? 'music-monaco-editor-select-item-selected' : ''}`}>
            {label}
        </div>
    )
}

export default Menu;

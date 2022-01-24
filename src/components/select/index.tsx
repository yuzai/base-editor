import React, { useCallback, useEffect, useRef, useState } from 'react';
import Arrow from '@components/icons/arrow';
import Menu from './components/menu';
import Position from './components/position';
import './index.less';

const instance = document.createElement('div');
instance.className = "music-monaco-editor-select-items";

interface SelectInterface extends React.FC<{
    defaultValue?: any,
    onChange?: (value: any) => void,
    getContainer?: () => HTMLElement,
    children?: React.ReactNode,
}> {
    Menu: typeof Menu
}

const Select:SelectInterface = ({
    defaultValue,
    onChange = () => ({}),
    getContainer,
    children
}) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ value: defaultValue, label: ''});
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!children) return;
        const childs = React.Children.toArray(children);
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            if (React.isValidElement(child)) {
                if (child.props.value === defaultValue) {
                    setData(child.props);
                    break;
                }
            }
        }
    }, [defaultValue]);

    useEffect(() => {
        return () => {
            if (document.body.contains(instance)) {
                document.body.removeChild(instance);
            }
        }
    }, []);

    useEffect(() => {
        function hide() {
            setVisible(false);
        }
        if (visible) {
            document.body.addEventListener('click', hide);
        } else {
            document.body.removeEventListener('click', hide);
        }
        return () => {
            document.body.removeEventListener('click', hide);
        }
    }, [visible]);

    const handleSelect = useCallback((data) => {
        setData(data);
        onChange && onChange(data);
        setVisible(false);
    }, [onChange]);

    return (
        <React.Fragment>
            <div
                ref={targetRef}
                className="music-monaco-editor-select">
                <div className="music-monaco-editor-select-content" onClick={(e) => {
                    e.stopPropagation();
                    setVisible(pre => !pre)
                }}>
                    {data.label}
                    <div className="music-monaco-editor-select-content-arrow">
                        <Arrow collpase={!visible} />
                    </div>
                </div>
            </div>
            {
                visible && (
                    <Position
                        instance={instance}
                        targetRef={targetRef}
                        getContainer={getContainer}>
                        {
                            React.Children.toArray(children).map(child => (
                                React.isValidElement(child) ? React.cloneElement(child, {
                                    defaultValue: data.value,
                                    handleSelect,
                                }) : child
                            ))
                        }
                    </Position>
                )
            }
        </React.Fragment>
    )
}

Select.Menu = Menu;

export default Select;

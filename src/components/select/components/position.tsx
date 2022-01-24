import React, { useEffect } from "react";
import ReactDom from 'react-dom';

const Position:React.FC<{
    instance: HTMLElement,
    children?: React.ReactNode,
    targetRef: React.RefObject<HTMLElement>,
    getContainer?: () => HTMLElement,
    onNotVisibleArea?: () => void,
}> = ({
    instance,
    targetRef,
    children = null,
    getContainer,
    onNotVisibleArea = () => ({}),
}) => {
    const container = getContainer && getContainer() || document.body;

    useEffect(() => {
        document.body.appendChild(instance);

        return () => {
            if (document.body.contains(instance)) {
                document.body.removeChild(instance);
            }
        }
    }, [instance]);

    useEffect(() => {
        function setInstanceStyle() {
            const { top, left, height, width } = targetRef.current!.getBoundingClientRect();
            const style = {
                top: document.documentElement.scrollTop + top + height + 1 + 'px',
                left: document.documentElement.scrollLeft + left + 'px',
            }
            instance.style.top = style.top;
            instance.style.left = style.left;
            instance.style.width = width + 'px';
            return { top, left, height }
        }
        setInstanceStyle();

        function handleScroll() {
            const { top, height } = setInstanceStyle();
            
            if (container.offsetTop > top) {
                onNotVisibleArea();
            }
            if (top - container.offsetTop + height > container.offsetHeight) {
                onNotVisibleArea();
            }
        }

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        }
    }, [targetRef]);

    return ReactDom.createPortal(children, instance);
};

export default Position;

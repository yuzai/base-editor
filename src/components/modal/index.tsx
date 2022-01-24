import { useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import './index.less';

const Modal = (props: any) => {
    const elRef = useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
        const rootEl = props.target || document.body;
        if (props.visible) {
            rootEl && rootEl.appendChild(elRef.current);
        } else {
            rootEl && rootEl.contains(elRef.current) && rootEl.removeChild(elRef.current);
        }
    }, [props.visible]);
    
    return ReactDom.createPortal(
        <div className="music-monaco-editor-modal">
            <div className="music-monaco-editor-modal-mask" onClick={() => props.onClose && props.onClose()}/>
            <div className="music-monaco-editor-modal-content">
                {(props.destroyOnClose && !props.visible) ? null : props.children}
            </div>
        </div>,
        elRef.current,
    )
}

export default Modal;
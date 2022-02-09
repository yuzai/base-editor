import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Close from '@components/icons/close';
import Button from '@components/button';
import './index.less';

interface Props {
    target?: HTMLElement | null,
    visible?: boolean,
    onClose?: (...args: any[]) => void,
    destroyOnClose?: boolean,
    children: any,
}
interface ModalInterface extends React.FC<Props> {
    create: (...args: any[]) => any,
    confirm: (...args: any[]) => any,
}

const Modal:ModalInterface = (props: any) => {
    const elRef = useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
        const rootEl = props.target || document.body;
        if (props.visible) {
            rootEl && rootEl.appendChild(elRef.current);
        } else {
            rootEl && rootEl.contains(elRef.current) && rootEl.removeChild(elRef.current);
        }
    }, [props.visible]);
    
    return ReactDOM.createPortal(
        <div className="music-monaco-editor-modal">
            <div className="music-monaco-editor-modal-mask" onClick={() => props.onClose && props.onClose()}/>
            <div className="music-monaco-editor-modal-content">
                {(props.destroyOnClose && !props.visible) ? null : props.children}
            </div>
        </div>,
        elRef.current,
    )
}

Modal.create = (props: any) => {
    const el = document.createElement('div');

    function close() {
        rootEl && rootEl.contains(el) && rootEl.removeChild(el);
    }
    
    ReactDOM.render(
        <div className={`music-monaco-editor-modal ${props.className || ''}`}>
            <div className="music-monaco-editor-modal-mask" onClick={close}/>
            <div className="music-monaco-editor-modal-content">
                {props.content(close)}
            </div>
        </div>,
        el,
    );

    const rootEl = props.target || document.body;
    rootEl && rootEl.appendChild(el);

    return {
        close: () => {
            rootEl && rootEl.contains(el) && rootEl.removeChild(el);
        }
    }
}

Modal.confirm = (props: any) => {
    const el = document.createElement('div');

    function close() {
        rootEl && rootEl.contains(el) && rootEl.removeChild(el);
    }
    
    ReactDOM.render(
        <div className={`music-monaco-editor-modal ${props.className || ''}`}>
            <div className="music-monaco-editor-modal-mask" onClick={close}/>
            <div className="music-monaco-editor-modal-content music-monaco-editor-modal-content-confirm">
                {
                    props.title && <div className="title">{props.title}</div>
                }
                <div className="content">{props.content(close)}</div>
                <div className="footer">
                    <Button onClick={() => {
                        if (props.onCancel) {
                            props.onCancel(close)
                        } else {
                            close();
                        }
                    }}>
                        {props.cancelText || '取消'}
                    </Button>
                    <Button
                        onClick={() => { props.onOk && props.onOk(close) }}
                        type="primary"
                        style={{ marginLeft: '4px' }}>
                        {props.okText || '确认'}
                    </Button>
                    {/* <div className="button button-default" onClick={close}>取消</div> */}
                    {/* <div className="button button-primary">确认</div> */}
                </div>
                <div className="close" onClick={close}>
                    <Close style={{
                        width: '12px',
                        height: '12px'
                    }} />
                </div>
            </div>
        </div>,
        el,
    );

    const rootEl = props.target || document.body;
    rootEl && rootEl.appendChild(el);

    return {
        close: () => {
            rootEl && rootEl.contains(el) && rootEl.removeChild(el);
        }
    }
}

export default Modal;
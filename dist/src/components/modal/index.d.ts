import React from 'react';
import './index.less';
interface Props {
    target?: HTMLElement | null;
    visible?: boolean;
    onClose?: (...args: any[]) => void;
    destroyOnClose?: boolean;
    children: any;
}
interface ModalInterface extends React.FC<Props> {
    create: (...args: any[]) => any;
    confirm: (...args: any[]) => any;
}
declare const Modal: ModalInterface;
export default Modal;

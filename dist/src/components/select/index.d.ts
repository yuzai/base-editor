import React from 'react';
import Menu from './components/menu';
import './index.less';
interface SelectInterface extends React.FC<{
    defaultValue?: any;
    onChange?: (value: any) => void;
    getContainer?: () => HTMLElement;
    children?: React.ReactNode;
}> {
    Menu: typeof Menu;
}
declare const Select: SelectInterface;
export default Select;

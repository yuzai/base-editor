import React from 'react';
import './index.less';
declare const Button: React.FC<{
    type?: string;
    className?: string;
    children?: any;
    onClick?: (...args: any[]) => void;
    style?: any;
}>;
export default Button;

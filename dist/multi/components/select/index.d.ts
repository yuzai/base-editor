import React from 'react';
import './index.less';
declare const Select: React.FC<{
    defaultValue?: string;
    value?: string;
    onChange?: (v: string) => void;
    options: Array<string>;
}>;
export default Select;

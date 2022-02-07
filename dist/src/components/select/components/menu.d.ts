import React from "react";
declare const Menu: React.FC<{
    label?: string;
    value: any;
    className?: string;
    handleSelect?: (obj: {
        value: any;
        label: string;
    }) => void;
    defaultValue?: string | number;
}>;
export default Menu;

import React from "react";
declare const Position: React.FC<{
    instance: HTMLElement;
    children?: React.ReactNode;
    targetRef: React.RefObject<HTMLElement>;
    getContainer?: () => HTMLElement;
    onNotVisibleArea?: () => void;
}>;
export default Position;

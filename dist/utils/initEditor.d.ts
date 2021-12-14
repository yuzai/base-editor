declare type monacoType = typeof import("monaco-editor");
declare global {
    interface Window {
        monaco: monacoType;
    }
}
export declare const startUp: () => void;
export {};

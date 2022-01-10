declare type monacoType = typeof import("monaco-editor");
declare global {
    interface Window {
        monaco: monacoType;
    }
}
export declare const themes: {
    [key: string]: any;
};
export declare function configTheme(name: string): Promise<void>;
export declare const startUp: () => void;
export {};

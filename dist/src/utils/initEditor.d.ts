declare type monacoType = typeof import("monaco-editor");
declare global {
    interface Window {
        monaco: monacoType;
        define: any;
        prettier: any;
        prettierPlugins: any;
        require: any;
    }
}
export declare const themes: {
    [key: string]: any;
};
export declare function configTheme(name: string): Promise<void>;
export declare const startUp: () => void;
export {};

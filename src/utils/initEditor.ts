import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
declare type monacoType = typeof import("monaco-editor");
import { ASSETSPATH } from './consts';
// import config from './eslintconfig';
declare global {
    interface Window {
        monaco: monacoType;
    }
}

function loadScript(url: string, cb: () => void) {
    const script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('body')[0].appendChild(script);
    script.onload = cb;
}

function loadCode(code: string) {
    const script = document.createElement('script');
    script.type = ' text/javascript';
    script.appendChild(document.createTextNode(code));
    document.getElementsByTagName('body')[0].appendChild(script);
}

let execed = false;

const grammerMap: {
    [key: string]: string,
} = {
    'source.ts': 'Typescript.tmLanguage.json',
    'source.js': 'Javascript.tmLanguage.json',
    'source.js.jsx': 'JavaScriptReact.tmLanguage.json',
    'source.ts.tsx': 'TypesSriptReact.tmLanguage.json',
    'source.css': 'css.tmLanguage.json',
    'source.less': 'less.tmLanguage.json',
    'text.html.basic': 'html.tmLanguage.json',
}

export const themes: {
    [key: string]: any,
} = {};

export async function configTheme(name: string) {
    let theme = themes[name];
    if (!theme) {
        theme = JSON.parse(await (await fetch(`${ASSETSPATH}themes/${name}.json`)).text());
        themes[name] = theme;
        // 定义主题
        window.monaco.editor.defineTheme(name, theme);
    }

    const prefix = '--monaco-';

    Object.keys(theme.colors).forEach(v => {
        document.documentElement.style.setProperty(`${prefix}${v.replace('.', '-')}`, theme.colors[v] || themes.OneDarkPro.colors[v] || 'rgba(0, 0, 0, 0)');
    })

    // 设置主题
    window.monaco.editor.setTheme(name);
}

async function addExtraLib() {
    let res = await (await fetch(`${ASSETSPATH}@types/react/index.d.ts`)).text();
    window.monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowJs: true,
        allowNonTsExtensions: true,
        allowSyntheticDefaultImports: true, // for use of import React from 'react' ranther than import * as React from 'react'
    })
    window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
        res,
        'file:///node_modules/@types/react/index.d.ts'
    );
    window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
        res,
        'file:///node_modules/@types/react/index.d.ts'
    );
    res = await (await fetch(`${ASSETSPATH}@types/react/global.d.ts`)).text();
    window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
        res,
        'file:///node_modules/%40types/react/global.d.ts'
    );
    window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
        res,
        'file:///node_modules/%40types/react/global.d.ts'
    );
    res = await (await fetch(`${ASSETSPATH}@types/react-dom/index.d.ts`)).text();
    window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
        res,
        'file:///node_modules/@types/react-dom/index.d.ts'
    );
    window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
        res,
        'file:///node_modules/@types/react-dom/index.d.ts'
    );
}

function configMonaco() {
    const init = async () => {
        window.monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
        });
        // 加载textmate语义解析webassembly文件
        await loadWASM(`${ASSETSPATH}onigasm.wasm`);
        //
        configTheme('OneDarkPro');

        addExtraLib();
    };
    init();

    window.monaco.languages.register({ id: 'JavascriptReact' });
    window.monaco.languages.register({ id: 'TypescriptReact' });
    
    // 创建语法映射
    const grammars = new Map();
    
    grammars.set('typescript', 'source.ts');
    grammars.set('javascript', 'source.js');
    grammars.set('JavascriptReact', 'source.js.jsx');
    grammars.set('TypescriptReact', 'source.ts.tsx');
    grammars.set('less', 'source.less');
    grammars.set('css', 'source.css');
    grammars.set('html', 'text.html.basic');
    
    // 创建一个注册表，可以从作用域名称来加载对应的语法文件
    const registry = new Registry({
        getGrammarDefinition: async (scopeName) => {
            const res = await (await fetch(`${ASSETSPATH}Grammars/${grammerMap[scopeName]}`)).text();
            return {
                format: 'json', // 语法文件格式，有json、plist
                content: res,
            };
        },
    });
    
    // 将语法映射揉进monaco
    function wireMonacoGrammars() {
        wireTmGrammars(window.monaco, registry, grammars);
    }

    // 延迟语法解析的修改，防止monaco在加载后覆盖次语法映射
    setTimeout(() => {
        wireMonacoGrammars();
    }, 3000);
}

export const startUp = () => {
    if (execed) return;
    execed = true;
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.min.js', () => {
        loadCode(`
            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' } });

            require(['vs/editor/editor.main'], function () {
            });
        `)
    });
    const interval = setInterval(() => {
        if(window.monaco) {
            configMonaco();
            clearInterval(interval);
        }
    }, 100);
}

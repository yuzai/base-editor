// @ts-nocheck
// import * as monaco from 'monaco-editor';
import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { ASSETSPATH } from './consts';

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
}

function configMonaco() {
    const init = async () => {
        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        //     noSemanticValidation: true,
        //     noSyntaxValidation: true,
        // });
        // 加载textmate语义解析webassembly文件
        await loadWASM(`${ASSETSPATH}onigasm.wasm`);
        // 获取主题文件
        const onDarkProTheme = JSON.parse(await (await fetch(`${ASSETSPATH}themes/OneDarkPro.json`)).text());
        // 定义主题
        monaco.editor.defineTheme('OneDarkPro', onDarkProTheme);
        // 设置主题
        monaco.editor.setTheme('OneDarkPro');
        /**
         * Use prettier to format JavaScript code.
         * This will replace the default formatter.
         */
        monaco.languages.registerDocumentFormattingEditProvider('javascript', {
            async provideDocumentFormattingEdits(model) {
                const prettier = await import('prettier/standalone');
                // @ts-ignore
                const babylon = await import('prettier/parser-babylon');
                const text = prettier.format(model.getValue(), {
                    parser: 'babylon',
                    plugins: [babylon],
                    singleQuote: true,
                });
            
                return [
                    {
                    range: model.getFullModelRange(),
                    text,
                    },
                ];
            },
        });
    };
    init();

    monaco.languages.register({ id: 'JavascriptReact' });
    monaco.languages.register({ id: 'TypescriptReact' });
    
    // 创建语法映射
    const grammars = new Map();
    
    grammars.set('typescript', 'source.ts');
    grammars.set('javascript', 'source.js');
    grammars.set('JavascriptReact', 'source.js.jsx');
    grammars.set('TypescriptReact', 'source.ts.tsx');
    grammars.set('less', 'source.less');
    grammars.set('css', 'source.css');
    
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
        wireTmGrammars(monaco, registry, grammars);
    }

    // 延迟语法解析的修改，防止monaco在加载后覆盖次语法映射
    setTimeout(() => {
        wireMonacoGrammars();
    }, 3000);
}

export const startUp = () => {
    if (execed) return;
    execed = true;
    loadScript('https://cdn.jsdelivr.net/npm/monaco-editor@0.25.0/min/vs/loader.js', () => {
        loadCode(`
            require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.30.1/min/vs' } });

            require(['vs/editor/editor.main'], function () {
                console.log(monaco);
            });
        `)
    });
    const interval = setInterval(() => {
        if(monaco) {
            configMonaco();
            clearInterval(interval);
        }
    }, 100);
}

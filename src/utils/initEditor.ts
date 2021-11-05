/*
* 初始化editor
*/
import * as monaco from 'monaco-editor';
import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

export const startUp = () => {
    const init = async () => {
        // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        //     noSemanticValidation: true,
        //     noSyntaxValidation: true,
        // });
        // 加载textmate语义解析webassembly文件
        await loadWASM('/onigasm.wasm');
        // 获取主题文件
        const onDarkProTheme = JSON.parse(await (await fetch('/themes/OneDarkPro.json')).text());
        // 定义主题
        monaco.editor.defineTheme('OneDarkPro', onDarkProTheme);
        // 设置主题
        monaco.editor.setTheme('OneDarkPro');
    };
    init();
    
    // 创建语法映射
    const grammars = new Map();
    
    grammars.set('typescript', 'source.ts');
    grammars.set('javascript', 'source.js');
    
    // 创建一个注册表，可以从作用域名称来加载对应的语法文件
    const registry = new Registry({
        getGrammarDefinition: async (scopeName) => {
            const res = await (await fetch(`/Grammars/Javascript.tmLanguage.json`)).text();
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

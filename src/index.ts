import * as monaco from 'monaco-editor';
import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

const init = async () => {
    await loadWASM('/onigasm.wasm');
    const onDarkProTheme = JSON.parse(await (await fetch('/themes/OneDarkPro.json')).text());
    monaco.editor.defineTheme('OneDarkPro', onDarkProTheme);
    monaco.editor.setTheme('OneDarkPro');
};
init();

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

function wireMonacoGrammars() {
    wireTmGrammars(monaco, registry, grammars);
}

setTimeout(() => {
    wireMonacoGrammars();
}, 3000);

const editor = monaco.editor.create(document.getElementById('container')!, {
    value: '',
    language: 'javascript',
    fontSize: 14,
    automaticLayout: true,
});
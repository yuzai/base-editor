import MultiEditor from './multi/Editor';

import Editor from './single/Editor';

import { startUp } from './utils/initEditor';

// 准备monaco-editor主题等
startUp();

export {
    Editor,
    MultiEditor,
}

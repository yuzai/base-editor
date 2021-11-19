export * from './multi/Editor';

export *  from './single/Editor';

import { startUp } from './utils/initEditor';

// 准备monaco-editor主题等
startUp();

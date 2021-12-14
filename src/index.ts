export * from './multi/Entry';

export *  from './single/Entry';

import { startUp } from './utils/initEditor';

// 准备monaco-editor主题等
startUp();

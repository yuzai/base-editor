// import MultiEditor from './multi/Editor';

import Editor from './single/Editor';

import { startUp } from './utils/initEditor';

startUp();

export default {
    a: () => {},
    b: () => {},
    Editor: Editor,
}

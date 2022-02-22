# monaco-base-ide

## 如何使用

### 安装

```
npm install yuzai-base-editor
```

### 使用

```js

import { MultiEditor } from 'yuzai-base-editor';

function IDE() {
    const defaultFiles = {
        '/src/app.jsx': `
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

(async () => {
  const {Button} = await import('./Button.jsx');
  const root = document.getElementById('root');
  ReactDOM.render((
    <div>
      <Button>Direct</Button>
    </div>
  ), root);
})();
`,
        '/src/app.css': 'body { background: #fff }',
        '/index.html': `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<div id="root"></div>
<script type="importmap">
    {
    "imports": {
        "react": "https://cdn.skypack.dev/react",
        "react-dom": "https://cdn.skypack.dev/react-dom",
        "lodash": "https://cdn.skypack.dev/lodash"
    }
    }
</script>
<script type="module">
    import './app/index.jsx';
    import './index.js';
</script>
</body>
</html>
                    `,
        '/src/test.ts': `
import { add } from './cc';

const App = () => {
    console.log(add(1, 2));
};

export default App;
`,
        '/src/cc.ts': `
export function add(a, b) {
    return a + b;
}

export function minus(a, b) {
    return a - b;
}
`
    }
    return (
        <div style={{ width: '800px', height: '600px' }}>
            <MultiEditor 
                defaultFiles={defaultFiles}
                options={{
                    fontSize: 14,
                    automaticLayout: true,
                }} />
        </div>
    )
}

export default IDE;
```

### 组件参数及方法

查看此[文档](https://yuzai.github.io/base-editor/docs/modules.html)

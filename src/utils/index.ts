import { ASSETSPATH } from "./consts";

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function generateFileTree(files: any) {
    const keys = Object.keys(files);
    const tree = {
        isDirectory: true,
        children: {},
        path: '/',
    };
    keys.forEach((key) => {
        const path = key.slice(1).split('/');
        let temp: any = tree.children;
        path.forEach((v, index) => {
            if (index === path.length - 1) {
                temp[v] = {
                    name: v,
                    path: key,
                    value: files[key],
                    _isFile: true,
                }
            } else if (temp[v]) {
                temp = temp[v].children;
            } else {
                temp[v] = {
                    _isDirectroy: true,
                    children: {},
                    path: '/' + path.slice(0, index + 1).join('/'),
                };
                temp = temp[v].children;
            }
        });
    });
    return tree;
}

export function addSourceFile(sourcetree: any, path: string, value?: string) {
    const copy = deepCopy(sourcetree);
    const paths = (path || '/').slice(1).split('/');
    const name = paths[paths.length - 1];
    let temp = copy.children;
    paths.forEach((v, index) => {
        if (index === paths.length - 1) {
            temp[v] = {
                name, 
                value: value || '',
                path,
                _isFile: true,
            }
        } else if (temp[v]) {
            temp = temp[v].children;
        } else {
            temp[v] = {
                _isDirectroy: true,
                children: {},
                path: '/' + paths.slice(0, index + 1).join('/'),
            };
            temp = temp[v].children;
        }
    });
    return copy;
}

export function deleteSourceFile(sourcetree: any, path: string) {
    const copy = deepCopy(sourcetree);
    const paths = (path || '/').slice(1).split('/');
    const name = paths[paths.length - 1];
    let temp = copy.children;
    paths.forEach((v, index) => {
        if (index === paths.length - 1) {
            delete temp[v];
        } else if (temp[v]) {
            temp = temp[v].children;
        } else {
            temp[v] = {
                _isDirectroy: true,
                children: {},
                path: '/' + paths.slice(0, index + 1).join('/'),
            };
            temp = temp[v].children;
        }
    });
    return copy;
}

export function editSourceFileName(sourcetree: any, path:string, name: string) {
    const copy = deepCopy(sourcetree);
    const paths = (path || '/').slice(1).split('/');
    let temp = copy.children;
    paths.forEach((v, index) => {
        if (index === paths.length - 1) {
            temp[name] = {
                name,
                path: '/' + paths.slice(0, index).concat(name).join('/'),
                value: temp[v].value,
                _isFile: true,
            }
            delete temp[v];
        } else if (temp[v]) {
            temp = temp[v].children;
        } else {
            temp[v] = {
                _isDirectroy: true,
                children: {},
                path: '/' + paths.slice(0, index + 1).join('/'),
            };
            temp = temp[v].children;
        }
    });
    return copy;
}

export function createOrUpdateModel(path: string, value: string) {
    // model 是否存在
    let model = window.monaco.editor
      .getModels()
      .find(model => model.uri.path === path);
    
    if (model) {
        if (model.getValue() !== value) {
            model.pushEditOperations(
                [],
                [
                    {
                        range: model?.getFullModelRange(),
                        text: value,
                    },
                ],
                () => [],
            );
        }
    } else if (path) {
        let type = '';
        if (path.indexOf('.') !== -1) {
            type = path.split('.').slice(-1)[0];
        } else {
            type = 'javascript';
        }
        const config: {
            [key: string]: string
        } = {
            'js': 'javascript',
            'ts': 'typescript',
            'less': 'less',
            'jsx': 'javascript',
            'tsx': 'typescript',
        }
        model = window.monaco.editor.createModel(
            value,
            config[type] || type,
            new window.monaco.Uri().with({ path, scheme: 'music' })
        );
        model.updateOptions({
            tabSize: 4,
        });
    }
}

// TODO:删除model
export function deleteModel(path: string) {
    // model 是否存在
    const model = window.monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (model) {
        model.dispose();
    } else {
        console.warn('要删除的文件不存在');
    }
}

// TODO:重命名model

export const copyDataToClipBoard = (
    data: string,
    callback?: (res: boolean) => void,
) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', data);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        callback && callback(true);
    } else {
        callback && callback(false);
    }
    document.body.removeChild(input);
};

export const worker = new Promise<Worker>(async (resolve) => {
    const codeString = await fetch(`${ASSETSPATH}eslint.worker.js`).then(res => res.text());

    // 在这里我没有使用 new Worker(`data:application/javascript, ${codeString}`) 这种方式
    // 而是使用了 URL.createObjectURL 以及 new Blob, 会将 JavaScript 字符串转换为如下格式
    // blob:http://same-domain/cd2930c0-f4ca-4a9f-b6b1-8242e520dd62
    // 因此不再会有跨域问题
    const localWorkerUrl = window.URL.createObjectURL(new Blob([codeString], {
        type: 'application/javascript'
    }));
    resolve(new Worker(localWorkerUrl));
});

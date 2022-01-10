import { ASSETSPATH } from "./consts";

export function generateFileTree(files: any) {
    const keys = Object.keys(files);
    const tree = {};
    keys.forEach((key) => {
        const path = key.slice(1).split('/');
        let temp: any = tree;
        path.forEach((v, index) => {
        if (index === path.length - 1) {
            temp[v] = {
                name: v,
                path: key,
                value: files[key]
            }
        } else if (temp[v]) {
            temp = temp[v];
        } else {
            temp[v] = {};
            temp = temp[v];
        }
        });
    });
    return tree;
}

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
    console.log(1);
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

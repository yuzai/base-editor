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

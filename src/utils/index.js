export function generateFileTree(files) {
    const keys = Object.keys(files);
    const tree = {};
    keys.forEach((key) => {
        const path = key.slice(1).split('/');
        let temp = tree;
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
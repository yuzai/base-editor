import ReactDOM, { unstable_batchedUpdates } from 'react-dom';
import { useCallback, useState, useEffect } from 'react';
import Editor from './Editor';

interface fileObj {
    [key: string]: string,
}

const filesName = [
    '/fn.js',
    '/app.js',
    '/cc.js',
    '/index.ts',
    '/src/index.js',
    '/styles/index.less',
    '/src/components/title/index.js',
    '/src/components/title/index.less',
];

const App = () => {
    const [value, setValue] = useState('');
    const [path, setPath] = useState('');
    const [files, setFiles] = useState<fileObj>({});

    useEffect(() => {
        // 获取多文件
        const promises = filesName.map(async v => await (await (fetch(`/editorfiles${v}`))).text());
        Promise.all(promises).then(filesContent => {
            const res:fileObj = {};
            filesContent.forEach((content, index) => {
                res[filesName[index]] = content;
            });
            unstable_batchedUpdates(() => {
                setFiles(res);
                setPath(filesName[0]);
                setValue(filesContent[0]);
            });
        })
    }, []);

    // 设置当前文件路径和value
    const handlePathChange = useCallback((key: string, value: string) => {
        setPath(key);
        setValue(value);
    }, []);

    // 同步ide内容修改
    const handleChange = useCallback((e) => {
        setValue(e);
        setFiles(pre => ({
            ...pre,
            [path]: e,
        }))
    }, [path]);

    return (
        <div>
            {
                Object.keys(files).length > 0 && (
                    <div style={{ width: '800px', height: '600px' }}>
                        <Editor
                            value={value}
                            files={files}
                            path={path}
                            onPathChange={handlePathChange}
                            onValueChange={handleChange}
                            options={{
                                fontSize: 14,
                                automaticLayout: true,
                            }} />
                    </div>
                )
            }
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
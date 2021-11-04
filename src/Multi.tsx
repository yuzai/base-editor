import ReactDOM, { unstable_batchedUpdates } from 'react-dom';
import { MouseEvent, useCallback, useState, useEffect } from 'react';
import Editor from './MultiEditor';

interface fileObj {
    [key: string]: string,
}

const filesName = ['/fn.js', '/app.js', '/cc.js'];

const App = () => {
    const [value, setValue] = useState('');
    const [path, setPath] = useState('');
    const [files, setFiles] = useState<fileObj>({});

    useEffect(() => {
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

    const handleClick = (e: MouseEvent<HTMLLIElement>) => {
        const key = e.currentTarget.dataset.src!;
        setPath(key);
        setValue(files[key]);
    };

    const handleChange = useCallback((e) => {
        setValue(e);
        setFiles(pre => ({
            ...pre,
            [path]: e,
        }))
    }, [path]);

    return (
        <div>
            <li data-src={filesName[0]} onClick={handleClick}>fn.js</li>
            <li data-src={filesName[1]} onClick={handleClick}>app.js</li>
            <li data-src={filesName[2]} onClick={handleClick}>cc.js</li>
            {
                Object.keys(files).length > 0 && (
                    <Editor
                        value={value}
                        files={files}
                        path={path}
                        language="javascript"
                        onValueChange={handleChange}
                        options={{
                            fontSize: 14,
                            automaticLayout: true,
                        }} />
                )
            }
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
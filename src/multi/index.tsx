import ReactDOM, { unstable_batchedUpdates } from 'react-dom';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import Editor from './Entry';
import { THEMES } from '../utils/consts';

interface filelist {
    [key: string]: string,
}

const filesName = [
    '/app.js',
    '/cc.js',
    '/app.ts',
    '/cc.ts',
    '/test.css',
    '/src/index.jsx',
    '/style.less',
    '/styles/index.less',
    '/src/components/title/index.js',
    '/src/components/title/index.less',
];

const App = () => {
    const [files, setFiles] = useState<filelist>({});
    const editorRef = useRef<any>(null);

    useEffect(() => {
        // 获取多文件
        const promises = filesName.map(async v => await (await (fetch(`/editorfiles${v}`))).text());
        Promise.all(promises).then(filesContent => {
            const res:filelist = {};
            filesContent.forEach((content, index) => {
                res[filesName[index]] = content;
            });
            unstable_batchedUpdates(() => {
                setFiles(res);
                // setPath(filesName[0]);
                // setValue(filesContent[0]);
            });
        })
    }, []);

    // 设置当前文件路径和value
    const handlePathChange = useCallback((key: string) => {
        console.log(key);
    }, []);

    // // 同步ide内容修改
    // const handleChange = useCallback((v: string) => {
    //     console.log(v);
    // }, []);

    // const handleFileChange = (key: string, value: string) => {
    //     // console.log(key, value);
    // }

    const [options, setOptions] = useState({
        fontSize: 14,
        automaticLayout: true,
    });

    const handleThemeChange = (e: any) => {
        setOptions(pre => (
            {
                ...pre,
                theme: e.target.value
            }
        ))
    };

    return (
        <div>
            <div onClick={() => console.log(editorRef.current?.getValue('/app.js')) }>ref api</div>
            <select name="theme" onChange={handleThemeChange}>
                {
                    THEMES.map(theme => <option key={theme} value={theme}>{theme}</option>)
                }
            </select>
            {
                Object.keys(files).length > 0 && (
                    <div style={{ width: '800px', height: '600px' }}>
                        <Editor
                            ref={editorRef}
                            // defaultPath="/fn.js"
                            defaultFiles={files}
                            // value={value}
                            // path={path}
                            onPathChange={handlePathChange}
                            // onValueChange={handleChange}
                            // onFileChange={handleFileChange}
                            options={options} />
                    </div>
                )
            }
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
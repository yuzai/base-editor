import ReactDOM, { unstable_batchedUpdates } from 'react-dom';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import Editor from '../src/multi/Entry';
import { themes } from '@utils/initEditor';
import { THEMES } from '@utils/consts';
import { copyDataToClipBoard } from '@utils';
interface filelist {
    [key: string]: string,
}

declare global {
    interface Window {
        eslint: any,
        linter: any,
    }
}

const filesName = [
    '/index.html',
    '/app/index.jsx',
    '/app/index.css',
    '/app/button.jsx',
    // '/app.js',
    // '/cc.js',
    // '/app.ts',
    '/cc.ts',
    // '/test.css',
    // '/src/index.jsx',
    '/style.less',
    // '/styles/index.less',
    // '/src/components/title/index.js',
    // '/src/components/title/index.less',
];

const App = () => {
    const [files, setFiles] = useState<filelist>({});
    const editorRef = useRef<any>(null);
    const [colors, setColors] = useState<{
        [key: string]: string,
    }>({});

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
        });
        setTimeout(() => {
            setColors(themes['OneDarkPro'].colors);
        }, 5000);
    }, []);

    // 设置当前文件路径和value
    const handlePathChange = useCallback((key: string) => {
        // console.log(key);
    }, []);

    // // 同步ide内容修改
    // const handleChange = useCallback((v: string) => {
    //     console.log(v);
    // }, []);

    // const handleFileChange = (key: string, value: string) => {
    //     console.log(key, value);
    // }

    const handleThemeChange = (e: any) => {
        editorRef.current.setTheme(e.target.value);
    };

    // const sandboxRef = useRef(null);

    // const sendMessage = () => {
    //     // @ts-ignore
    //     sandboxRef.current.contentWindow.postMessage({
    //         type: 'SAVE_FILES',
    //         files,
    //     }, 'http://localhost:8081');
    // };

    // useEffect(() => {
    //     window.addEventListener('message', res => console.log(res));
    // }, []);

    const linter = useCallback(() => {
        console.log(editorRef.current.getValue('/index.jsx'));
    }, []);

    return (
        <div>
            <div onClick={() => console.log(editorRef.current) }>ref api</div>
            {/* <div onClick={sendMessage}>send postmessage</div> */}
            <div onClick={linter}>eslint</div>
            <div onClick={() => setColors(themes['OneDarkPro'].colors)}>refresh theme color</div>
            <select
                name="theme"
                onChange={handleThemeChange}
                defaultValue="OneDarkPro" >
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
                            options={{
                                fontSize: 14,
                                automaticLayout: true,
                            }} />
                    </div>
                )
            }
            {/* <iframe src="http://localhost:8081/index.html" ref={sandboxRef} /> */}
            <div style={{
                position: 'absolute',
                right: '0',
                top: '0',
                bottom: '0',
                width: '400px',
                overflow: 'scroll',
            }}>
                {
                    Object.keys(colors).map(v => (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onClick={() => {
                                copyDataToClipBoard(`var(--monaco-${v.replace('.', '-')})`)
                            }}
                            key={v}>
                            <div style={{
                                marginRight: '5px',
                            }}>{v}</div>
                            <div style={{
                                width: '100px',
                                height: '14px',
                                background: colors[v],
                            }} />
                        </div>)
                    )
                }
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
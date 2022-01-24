import ReactDOM from 'react-dom';
import { MouseEvent, useCallback, useState, } from 'react';
import Editor from '../src/single';

export const App = () => {
    const [value, setValue] = useState('console.log("test")');

    const handleClick = (e: MouseEvent<HTMLLIElement>) => {
        const src = e.currentTarget!.dataset.src;
        fetch(`/editorfiles/${src}`).then(v => v.text()).then((content) => {
            setValue(content);
        });
    };

    const handleChange = useCallback((e) => {
        setValue(e);
    }, [])

    return (
        <div>
            <li data-src="fn.js" onClick={handleClick}>fn.js</li>
            <li data-src="app.js" onClick={handleClick}>app.js</li>
            <li data-src="cc.js" onClick={handleClick}>cc.js</li>
            <Editor
                defaultValue={value}
                value={value}
                language="javascript"
                onValueChange={handleChange}
                options={{
                    fontSize: 14,
                    automaticLayout: true,
                }} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("single"));
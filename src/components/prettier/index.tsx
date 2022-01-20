import { useEffect } from 'react';
import PrettierIcon from '../icons/prettier';

const Prettier = (props: any) => {

    useEffect(() => {
        async function loadPrettier() {
            function provideDocumentFormattingEdits(model: any) {
                const text = window.prettier.format(model.getValue(), {
                    filepath: model.uri.path,
                    plugins: window.prettierPlugins,
                    singleQuote: true,
                    tabWidth: 4,
                });
            
                return [
                    {
                    range: model.getFullModelRange(),
                    text,
                    },
                ];
            }
            window.monaco.languages.registerDocumentFormattingEditProvider('javascript', {
                provideDocumentFormattingEdits
            });
            window.monaco.languages.registerDocumentFormattingEditProvider('typescript', {
                provideDocumentFormattingEdits
            });
            setTimeout(() => {
                window.monaco.languages.registerDocumentFormattingEditProvider('html', {
                    provideDocumentFormattingEdits
                });
            }, 3000);
            window.monaco.languages.registerDocumentFormattingEditProvider('css', {
                provideDocumentFormattingEdits
            });
            window.monaco.languages.registerDocumentFormattingEditProvider('less', {
                provideDocumentFormattingEdits
            });
        }
        loadPrettier();
    }, []);

    return (
        <div {...props}>
            <PrettierIcon />
        </div>
    )
}

export default Prettier;

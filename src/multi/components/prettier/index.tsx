import { useEffect, useState, useRef, useCallback } from 'react';
import PrettierIcon from '../icons/prettier';

const Prettier = (props: any) => {
    const [loading, setLoading] = useState(true);
    const prettierRef = useRef<any>({});
    const babylonRef = useRef<any>({});

    useEffect(() => {
        async function loadPrettier() {
            prettierRef.current = await import('prettier/standalone');
            // @ts-ignore
            babylonRef.current = await import('prettier/parser-babylon');
            setLoading(false);
            window.monaco.languages.registerDocumentFormattingEditProvider('javascript', {
                async provideDocumentFormattingEdits(model) {
                    const text = prettierRef.current.format(model.getValue(), {
                        parser: 'babylon',
                        plugins: [babylonRef.current],
                        singleQuote: true,
                    });
                
                    return [
                        {
                        range: model.getFullModelRange(),
                        text,
                        },
                    ];
                },
            });
        }
        loadPrettier();
    }, []);

    return (
        <div {...props}>
            {
                !loading && <PrettierIcon />
            }
        </div>
    )
}

export default Prettier;

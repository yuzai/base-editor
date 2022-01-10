import React, { useEffect } from 'react';
import prettier from 'prettier/standalone';
// @ts-ignore
import babylon from 'prettier/parser-babylon';
import PrettierIcon from '../icons/prettier';

const Prettier = (props: any) => {

    useEffect(() => {
        async function loadPrettier() {
            window.monaco.languages.registerDocumentFormattingEditProvider('javascript', {
                async provideDocumentFormattingEdits(model) {
                    const text = prettier.format(model.getValue(), {
                        parser: 'babylon',
                        plugins: [babylon],
                        singleQuote: true,
                        tabWidth: 4,
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
            <PrettierIcon />
        </div>
    )
}

export default Prettier;

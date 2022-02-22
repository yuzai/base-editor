importScripts('https://yuzai.github.io/base-editor/public/eslint.js');

const baseRuleChange = {
    'react/jsx-filename-extension': 0,
    'react/prop-types': 1,
    'react/jsx-indent': ['error', 4],
    'react/jsx-indent-props': ['error', 4],
    'react/jsx-closing-bracket-location': ['error', 'after-props'],
    'react/destructuring-assignment': 'off',
    'react/sort-comp': 'off',
    // https://github.com/yannickcr/eslint-plugin-react/issues/1846
    'react/button-has-type': 'off',
    'react/require-default-props': ['warn', {
        forbidDefaultForRequired: true,
    }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-fragments': 'off',
    'react/static-property-placement': 'off',
    'react/state-in-constructor': 'off',
    'react/function-component-definition': 0,

    /**
         * eslint
         */
    'comma-dangle': ['error', {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'only-multiline'
    }],
    indent: ['error', 4, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        // MemberExpression: null,
        FunctionDeclaration: {
            parameters: 1,
            body: 1
        },
        FunctionExpression: {
            parameters: 1,
            body: 1
        },
        CallExpression: {
            arguments: 1
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
        ignoreComments: false
    }],
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    'one-var': 'off',
    'one-var-declaration-per-line': 'off',
    'no-restricted-syntax': [
        'error',
        {
            selector: 'LabeledStatement',
            message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
            selector: 'WithStatement',
            message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
    ],
    'prefer-destructuring': 'off',
    'no-new': 'off',
    'no-script-url': 'off',
}

const config = {
    ...self.linter.config,
    rules: {
        ...self.linter.config.rules,
        ...baseRuleChange,
    },
    settings: {
        react: {
            version: 'v17.0.1',
        }
    }
}

const severityMap = {
    2: 8, // 2 for eslint is error
    1: 4, // 1 for eslint is warning
}

function getExtName(path) {
    const arr = path.split('.');
    return arr[arr.length - 1] || '';
}

const ruleDefines = self.linter.esLinter.getRules();

self.addEventListener('message', function (e) {
    const { code, version, path } = e.data;
    const extName = getExtName(path);
    if (['js', 'jsx'].indexOf(extName) === -1) {
        self.postMessage({ markers: [], version });
        return;
    }
    const errs = self.linter.esLinter.verify(code, config);
    const markers = errs.map(err => ({
        code: {
            value: err.ruleId,
            target: ruleDefines.get(err.ruleId).meta.docs.url,
        },
        startLineNumber: err.line,
        endLineNumber: err.endLine,
        startColumn: err.column,
        endColumn: err.endColumn,
        message: err.message,
        severity: severityMap[err.severity],
        source: 'eslint',
    }));
    self.postMessage({ markers, version });
});
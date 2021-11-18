const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const devServer = {
}

if (process.env.CLOUDIDE_DEV_PORT) {
    // 设置热更新的端口为80
    devServer.host = '0.0.0.0';
    devServer.allowedHosts = 'all';
    devServer.client = {
        webSocketURL: 'http://0.0.0.0/ws',
    }
}

module.exports = {
    entry: {
        app: "./src/index.ts",
        // 'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		// 'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
		// 'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
		// 'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
		// 'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
    },
    output: {
        globalObject: 'self',
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
            {
                test: /\.(css|less)$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg|ttf)$/,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
        new MonacoWebpackPlugin({
			languages: ['typescript', 'javascript', 'css']
		}),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),

    ],
};
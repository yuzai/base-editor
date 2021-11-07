const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const monacoEditorCorePath = development ? '/Users/maxiaobo/Documents/netease/music-monaco-editor/base-editor/node_modules/monaco-editor-core/dev/vs' : '/Users/maxiaobo/Documents/netease/music-monaco-editor/base-editor/monaco-editor-core/min/vs';

// const monacoEditorCorePath = '/Users/maxiaobo/Documents/netease/music-monaco-editor/base-editor/node_modules/monaco-editor/min/vs';
// const onigasmPath = '/Users/maxiaobo/Documents/netease/music-monaco-editor/base-editor/node_modules/onigasm/lib';

module.exports = {
    entry: "./src/index.ts",
    output: { path: path.join(__dirname, "build"), filename: "index.bundle.js" },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        // static: path.join(__dirname, "src")
    },
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
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
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
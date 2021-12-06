const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js",
        libraryTarget: 'umd',
    },
    mode: "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
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
                test: /\.(jpg|jpeg|png|gif|mp3|svg|ttf)$/,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new MonacoWebpackPlugin({
			languages: ['typescript', 'javascript', 'css']
		}),
        new webpack.DefinePlugin({
            _ASSETSPATH: JSON.stringify('https://st.qa-qwe.igame.163.com/g/monaco-editor/'),
        })
    ],
    externals: {
        'react': 'react',
        'react-dom': 'react-dom',
    },
};
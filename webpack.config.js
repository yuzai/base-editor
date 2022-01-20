// @ts-nocheck
/* eslint-disable */
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Alias = require('alias-jsconfig-webpack-plugin');

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
        app: "./demo/index.ts",
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
            template: path.join(__dirname, "demo", "index.html"),
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.DefinePlugin({
            _ASSETSPATH: JSON.stringify('/'),
        }),
        new Alias({
            language: 'ts', // or 'ts'
            jsx: true, // default to true,
            indentation: 4, // default to 4, the indentation of jsconfig.json file
        }),
    ],
    resolve: {
        modules: ['demo', 'src', 'node_modules'],
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@utils': path.resolve(__dirname, './src/utils'),
        }
    }
};
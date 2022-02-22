// @ts-nocheck
/* eslint-disable */
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Alias = require('alias-jsconfig-webpack-plugin');

module.exports = {
    entry: {
        app: "./demo/index.ts",
    },
    output: {
        globalObject: 'self',
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    mode: "production",
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
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "demo", "index.html"),
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.DefinePlugin({
            _ASSETSPATH: JSON.stringify('/base-editor/public/'),
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
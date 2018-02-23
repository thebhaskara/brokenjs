const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // output folder path
        path: path.resolve(__dirname, 'dist'),
        filename: 'broken.js',
        // expose the library with following name
        library: 'broken',
        // Variable: as a global variable made available by a script tag (libraryTarget:'var').
        // This: available through the this object (libraryTarget:'this').
        // Window: available trough the window object, in the browser (libraryTarget:'window').
        // UMD: available after AMD or CommonJS require (libraryTarget:'umd').
        libraryTarget: 'umd'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new UglifyJSPlugin()
    ],
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
};
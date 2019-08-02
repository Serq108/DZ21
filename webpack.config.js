var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'output'),
        filename: 'bundle.min.js',
    },
    module: {
        rules: [
                { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']},
                { test: /\.png$/, loader: 'file-loader' },
                {test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less']
    },
    devtool: 'inline-source-map',
    devServer: {
        port: '3002',
        proxy: {
                 '/api': {
                  target: 'http://localhost:8001',
                  pathRewrite: {'^/api' : ''}
                  }
            }
        },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/html/template.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/html/templog.html'
        }),

        new MiniCssExtractPlugin({ filename: 'main.css' }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    ]
};

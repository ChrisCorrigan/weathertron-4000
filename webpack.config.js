const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    mode: 'development',
    entry: './src/js/main.js',
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, './public')
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([
            // { from: './src/public/', to: './' },
        ])
    ],
    
    devServer: { 
        contentBase: './public', 
        inline: true,
        port: 3000
    }
};
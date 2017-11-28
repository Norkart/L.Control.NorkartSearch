'use strict';
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: './src/L.Control.NorkartSearch.jsx',
    output: {
        libraryTarget: 'var',
        filename: 'build/L.Control.NorkartSearch.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'leaflet': 'L',
        'reqwest': 'reqwest'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: {
            rewrites: [{from: /^\/$/, to: '/demo/index.html'}],
            index: '/demo/index.html'
        },
        inline: true,
        port: 8080
    },
    plugins: [
        new ExtractTextPlugin('build/L.Control.NorkartSearch.css'),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ]
};

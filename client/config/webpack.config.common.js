'use strict';

const webpack = require('webpack');
const helpers = require('./helpers');

const BannerPlugin = require('webpack/lib/BannerPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 处理html文件做变量替换等
const HtmlWebpackPlugin = require('html-webpack-plugin');
//https://github.com/kossnocorp/assets-webpack-plugin
//维护一份编译后的资源列表
const AssetsPlugin = require('assets-webpack-plugin');
// 提取公共部分
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
// 清空发布目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 删除重复依赖的文件
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
// // 定义一些全局变量
const ProvidePlugin = require('webpack/lib/ProvidePlugin');


const METADATA = {
    title: '迁徙图',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
    CDN: "your cdn url",
    CONFIG: {
        // your app config,自定义配置信息
    }
};

module.exports = {
  // 设置一些跟页面有关的变量
  // metadata: METADATA,
  entry: {
    polyfills: './src/polyfills.js',
    main: './src/main.js'
  },

  resolve: {
    // alias: {
    //   vue: 'vue/dist/vue.common.js'
    // },
    extensions: ['.js', '.json'],
    modules: [helpers.root('src'), 'node-modules']
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'source-map-loader',
      enforce: 'pre',
      exclude: [helpers.root('node_modules')]
    }/*, {
      test: /polyfills.js$/,
      loader: 'babel-loader',
      options: {
        "presets": ["es2015", { "modules": true }]// 区别webpack对ES6的整体策略
      },
      exclude: /(node_modules|bower_components)/
    }*/, {
      test: /\.css$/,
      use: ['to-string-loader', 'css-loader']
    }, {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: [helpers.root('src/index.html')]
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'sass-loader']
    }]
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: helpers.root(''), // An absolute path for the root  of webpack.config.js
      verbose: true, // Write logs to console.
      dry: false // Do not delete anything, good for testing.
    }),
    new BannerPlugin({
      banner: 'jkkj',
      // raw: true,
      entryOnly: true
    }),
    new AssetsPlugin({
      path: helpers.root('dist'),
      filename: 'webpack-assets.json',
      prettyPrint: true
    }),
    new DedupePlugin(),
    // new OccurenceOrderPlugin(true),webpack2.0不再需要
    new CommonsChunkPlugin({
      name: ['polyfills']
    }),
    new CopyWebpackPlugin([{
      from: helpers.root('src/assets'),
      to: helpers.root('dist/assets')
    }]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: METADATA.title,
      metadata: METADATA,
      chunksSortMode: 'dependency'
    })//,

    // new ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    //   "_": 'underscore'
    // })
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
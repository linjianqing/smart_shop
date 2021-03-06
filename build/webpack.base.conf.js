var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
const os = require('os')
const HappyPack = require('happypack')
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length}) // 采用多进程，进程数由CPU核数决定

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  cache: true,
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  externals: {
    'yunnexDialog': 'yunnexDialog'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  plugins: [
    // ...
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happThreadPool
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'happypack/loader?id=js' // 将loader换成happypack
          }
        },
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.js$/,
        loader: ['happypack/loader?id=js'], // 将loader换成happypack
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [resolve('src/assets')],
        options: {
          limit: 1000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.scss$/,
        include: [resolve('src/assets/css')],
        loader: 'style!css!sass',
      }
    ]
  }
}

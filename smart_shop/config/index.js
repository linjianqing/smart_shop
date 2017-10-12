// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var networkInfo = {
  target: 'http://m.test-a.saofu.cn/',
  // target: 'http://localhost:8080/',
  changeOrigin: true,
  onProxyReq: function (proxyReq, req, res) {
    // proxyReq.setHeader('Cookie', '10549840601068216320=oPnoxw-MGcByUxH_GXn_8beZqLjE') //  lixibo
    // proxyReq.setHeader('Cookie', '10549840601068216320=oPnoxw3lyGo9Ng5m1EI0EqLVbHcs')  // 康福
    // proxyReq.setHeader('Cookie', '10549840601068216320=oPnoxw0KDdwPnR7-DD5AMZ_u-0tw') //  李政
    proxyReq.setHeader('Cookie', '10549840601068216320=oPnoxw2d3zm8vbilIqc0-FFPPB0I') //  苏传涛
  }
}
//  集成环境
var networkInfo_ci = {
  target: 'http://zhcttest.zb25.com.cn/',
  // target: 'http://localhost:8080/',
  changeOrigin: true,
  onProxyReq: function (proxyReq, req, res) {
    proxyReq.setHeader('Cookie', '10549840601068216320=oHQU6wOzeTZ5Uy7mRTLEvWRZjLnE')  // lixibo
    // proxyReq.setHeader('Cookie', '10549840601068216320=oHQU6wGlUv-Ck4lyZBdTDdPR9c1s')  // 超
    // proxyReq.setHeader('Cookie', '10549840601068216320=oHQU6wP0M0qcHTbqKR_neAm8vdw0')  // 李崇达

  }
}
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/smart_shop.jsp'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static/smart_shop',
    assetsPublicPath: '/',
    // assetsPublicPath: '/saofu-mobile/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8085,
    autoOpenBrowser: false,
    openPath: '/?branchId=1516663022#/', //对应的商户
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // 这些是测试环境用
      '/wxcanyin': networkInfo,
      '/wxQueue': networkInfo,
      '/smart_shop': networkInfo,
      '/wxmarketing': networkInfo,
      // 这个是集成环境用
      '/saofu-mobile': networkInfo_ci,
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

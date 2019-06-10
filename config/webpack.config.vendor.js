const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'array-to-tree',
      'axios',
      'base-64',
      'blob-util',
      'braft-editor',
      'classnames',
      'clipboard',
      'deepmerge',
      'dom-to-image',
      'downloadjs',
      'echarts',
      'echarts-of-react',
      'html2canvas',
      'jspdf',
      'lodash',
      'lodash.clonedeep',
      'lodash.debounce',
      'lodash.isequal',
      // 'lz-components-and-utils',
      // 'lz-request',
      'moment',
      'moveto',
      'nonsupport-ie-react',
      'object-assign',
      'object-values',
      'omit.js',
      'qs',
      'prop-types',
      're-resizable',
      'rc-count-down',
      'react-color',
      'react-contextmenu',
      'react-draggable',
      'react-fullscreen-loading',
      'react-intl',
      'react-loadable',
      'react-markdown',
      'react-redux',
      'react-resizable',
      'redux',
      'swiper',
      'xlsx',
      'wolfy87-eventemitter'
    ]
  },
  output: {
    path: path.join(__dirname, '../public'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: '[name]'
    })
  ]
};

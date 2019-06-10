const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router-dom', 'antd']
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

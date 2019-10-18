const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    historyApiFallback: true,
    overlay: true,
    stats: 'minimal',
    port: 8080,
    
  }
};
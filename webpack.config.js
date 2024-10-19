const path = require('path')

module.exports = {
  entry: {
    statsviewer: ['./js/utils.js', './js/statsviewer.js'], // statsviewer bundle
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
}

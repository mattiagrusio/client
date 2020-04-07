const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const entry = path.join(__dirname, './src/renderer/index.js');
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;
const outputPath = path.join(__dirname, './dist');

module.exports = {
  node: {
    fs: 'empty',
  },
  entry,
  output: {
    path: outputPath,
    filename: 'index.js',
  },
    module: {
    rules: [
      { test: entry, loader: 'expose-loader?index' },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },  
    ].concat(vtkRules),
  },
  plugins: [
    new FilterWarningsPlugin({
        exclude: /Critical dependency: the request of a dependency is an expression/,
      }),
    new CopyPlugin([
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
      to: path.join(__dirname, 'dist', 'itk', 'WebWorkers'),
      },
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
      to: path.join(__dirname, 'dist', 'itk', 'ImageIOs'),
      },
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'MeshIOs'),
      to: path.join(__dirname, 'dist', 'itk', 'MeshIOs'),
      },
    ]),
  ],
  performance: {
      maxAssetSize: 10000000
  },
  externals: {
  react: "react",
  "better-sqlite3": "commonjs better-sqlite3",
},

};
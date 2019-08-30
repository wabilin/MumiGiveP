const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const projectDir = __dirname;
const sourceDir = path.join(projectDir, 'src');
const staticDir = path.join(projectDir, 'addon');
const buildDir = path.join(projectDir, 'dist');
const config = {
  optimization: {
    minimize: true,
  },

  entry: {
    mumi: path.join(sourceDir, 'content_scripts/mumi.js'),
    popup: path.join(sourceDir, 'popup/popup.js'),
  },

  output: {
    path: buildDir,
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [buildDir] }),
    new CopyWebpackPlugin([
      {
        from: staticDir,
        to: buildDir,
      },
    ]),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.optimization.minimize = false;
    config.devtool = 'source-map';
  }

  return config;
};

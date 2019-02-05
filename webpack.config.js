const path = require('path');

const projectDir = __dirname;
const sourceDir = path.join(projectDir, 'src');
const config = {
  optimization: {
    minimize: true,
  },

  entry: {
    mumi: path.join(sourceDir, 'content_scripts/mumi.js'),
    popup: path.join(sourceDir, 'popup/popup.js'),
  },

  output: {
    path: path.resolve(projectDir, 'addon'),
    filename: '[name].js',
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.optimization.minimize = false;
    config.devtool = 'source-map';
  }

  return config;
};

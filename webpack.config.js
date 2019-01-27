const path = require("path");

const config = {
  optimization: {
    minimize: true
  },

  entry: {
    mumi: "./content_scripts/mumi.js",
    popup: "./popup/popup.js"
  },

  output: {
    path: path.resolve(__dirname, "addon"),
    filename: "[name].js"
  }
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.optimization.minimize = false;
    config.devtool = 'source-map'
  }

  return config;
};

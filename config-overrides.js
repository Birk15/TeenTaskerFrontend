module.exports = function override(config, env) {
  // Deaktiviere Polyfills für Node.js-Module
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: false,
    os: false,
    crypto: false,
  };

  return config;
};
module.exports = {
  // Handle 404 redirects for GitHub Pages
  devServer: {
    historyApiFallback: true,
  },
};

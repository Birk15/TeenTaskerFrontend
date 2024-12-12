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

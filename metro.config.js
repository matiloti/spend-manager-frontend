const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Bind Metro to all interfaces for Docker/network access
config.server = {
  ...config.server,
  port: 8081,
  host: '0.0.0.0',
};

module.exports = withNativeWind(config, { input: "./src/global.css" });

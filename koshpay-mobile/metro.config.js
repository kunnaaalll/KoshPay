const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Polyfill for package exports support in Metro/RN
config.resolver.sourceExts.push('cjs');

// Enable package exports to support newer libraries like @solana/web3.js dependencies
config.resolver.unstable_enablePackageExports = true;

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  // Alias the internal crypto.js file if it can't be resolved via exports
  // Note: react-native-get-random-values polyfills crypto, but some libs look for specific paths
};

// Filter out the noisy warnings if resolution succeeds via fallback
const originalLog = console.warn;
console.warn = (...args) => {
    if (args.length > 0 && typeof args[0] === 'string' && (
        args[0].includes('Attempted to import the module') && (
            args[0].includes('rpc-websockets') || 
            args[0].includes('@noble/hashes')
        )
    )) {
        return;
    }
    originalLog(...args);
};

module.exports = config;

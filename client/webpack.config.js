// Import required plugins and modules
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    // Set the mode to development for better debugging and build speed
    mode: 'development',
    // Define entry points for the application
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    // Configure output for the bundles
    output: {
      filename: '[name].bundle.js', // Output bundle name pattern
      path: path.resolve(__dirname, 'dist'), // Output directory
    },
    plugins: [
      // Plugin to generate the HTML file with injected script tags
      new HtmlWebpackPlugin({
        template: './index.html', // Template file
        title: 'JATE' // Title of the generated HTML file
      }),

      // Plugin to inject our custom service worker
      new InjectManifest({
        swSrc: './src-sw.js', // Source of the custom service worker
        swDest: 'src-sw.js', // Destination in the output directory
      }),

      // Plugin to generate the manifest.json file for PWA configuration
      new WebpackPwaManifest({
        fingerprints: false, // Disable fingerprints for the manifest
        inject: true, // Inject the manifest link into the HTML
        name: 'JATE', // Name of the PWA
        short_name: 'Text editor', // Short name of the PWA
        description: 'Destiny is a great game!', // Description of the PWA
        background_color: '#225ca3', // Background color for the PWA
        theme_color: '#225ca3', // Theme color for the PWA
        start_url: './', // Start URL for the PWA
        publicPath: './', // Public path for the PWA
        icons: [
          {
            src: path.resolve('src/images/logo.png'), // Path to the icon image
            sizes: [96, 128, 192, 256, 384, 512], // Different sizes for the icon
            destination: path.join('assets', 'icons'), // Destination directory for icons
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i, // Test for CSS files
          use: ['style-loader', 'css-loader'], // Use style-loader and css-loader for CSS files
        },
        {
          test: /\.m?js$/, // Test for JavaScript files
          exclude: /node_modules/, // Exclude node_modules directory
          // Use babel-loader to transpile JavaScript files
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // Preset for ECMAScript 6
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'], // Babel plugins
            },
          },
        },
      ],
    },
  };
};

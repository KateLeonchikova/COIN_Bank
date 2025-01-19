/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = (env) => ({
  entry: './src/main.js',
  output: {
    filename: 'main.[contenthash].js',
    publicPath: '/',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][contenthash][ext]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][contenthash][ext]',
        },
      },
      {
        test: /\.scss$/i,
        use: [
          env.production ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          env.production ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Coin',
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
    new Dotenv({
      path: `.env.${env.production ? 'production' : 'development'}`,
    }),
    new webpack.DefinePlugin({
      'process.env.WEBPACK_API_URL': JSON.stringify(
        process.env.WEBPACK_API_URL
      ),
      'process.env.WEBPACK_WS_URL': JSON.stringify(process.env.WEBPACK_WS_URL),
    }),
  ],

  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
              ['imagemin-mozjpeg', { quality: 75, progressive: true }],
              ['imagemin-pngquant', { quality: [0.65, 0.8] }],
              [
                'svgo',
                {
                  plugins: [
                    'preset-default',
                    {
                      name: 'addAttributesToSVGElement',
                      params: {
                        attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
  },

  devtool: 'source-map',
});

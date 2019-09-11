const { resolve } = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const apiClient = require('./src/utils/api-client');
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const development = environment === 'development';
const DIST_DIR = resolve(__dirname, './dist');
const SRC_DIR = resolve(__dirname, './src');
const STATIC_DIR = resolve(__dirname, './static');

const config = {
  cache: true,
  mode: environment,
  context: SRC_DIR,
  devtool: development ? 'cheap-module-eval-source-map' : 'source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      SRC_DIR,
      'node_modules',
    ],
  },

  entry: {
    main: './index.jsx',
  },

  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: 'js/[name].js',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: SRC_DIR,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: development ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              // modules: { localIdentName: '[name]-[local]-[hash:base64:4]' },
              importLoaders: 3,
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: 'inline' } },
          { loader: 'resolve-url-loader' },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          { loader: '@svgr/webpack', options: { svgoConfig: { plugins: [ { prefixIds: false }, { removeUselessDefs: false }, { cleanupIDs: false }, ] } } },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.s?css$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'file-loader', options: { name: '[path][name].[ext]' } },
          { loader: 'svgo-loader', options: { plugins: [{ removeTitle: true }] } },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico|zip|pdf)$/i,
        loader: 'file-loader',
        options: {
          name() {
            if (development) {
              return '[path][name].[ext]'
            }

            return '[path][name].[hash:6].[ext]'
          }
        }
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
    }),
    new CopyWebpackPlugin(
      [
        { from: STATIC_DIR, to: DIST_DIR },
      ]
    ),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      templateParameters: {
        environment,
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      logLevel: 'info',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment),
    }),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],

  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 3030,
    host: 'localhost',
    historyApiFallback: true,
    before: (app) => {
      app.use(bodyParser());
      app.get('/users/me/:token', (req, res) => {
        apiClient.checkIfValid(req.params.token)
          .then((user) => {
            res.json(user);
          })
          .catch(err => {
            res.status(403).send(err);
          });
      });
      app.post('/auth/login', (req, res) => {
        apiClient.getAuthUser(req.body.login, req.body.password)
          .then((auth) => {
            res.json(auth);
          })
          .catch(err => {
            res.status(403).send(err);
          });
      });
    },
  },
};

if (development) {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

if (!development) {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    })
  );
}

module.exports = config;

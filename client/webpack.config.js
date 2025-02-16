const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    historyApiFallback: true,
    port: 5173,
    hot: 'only',
    liveReload: true,
    open: {
      app: {
        name: process.platform === 'win32' ? 'chrome' : 'google-chrome',
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
      overlay: true,
      progress: true,
      reconnect: true,
      logging: 'info'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, './tsconfig.json')
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html', '**/favicon.ico']
          }
        }
      ]
    })
  ]
}; 
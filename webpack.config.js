const path = require('path');

module.exports = {
  entry: './client/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './client/build'),
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                        ]
                    }
                }
            ]
        }
    ]
  }
};
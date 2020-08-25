const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./test/app.js",
    devtool: "inline-source-map",
    devServer: {
        contentBase: './public',
        port: '11111'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ]
}
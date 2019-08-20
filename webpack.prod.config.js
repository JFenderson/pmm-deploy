const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
	entry: {
		main: './src/index.js'
	},
	output: {
		path: path.join(__dirname, '/dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	target: 'web',
	devtool: '#source-map',
	// Webpack 4 does not have a CSS minifier, although
	// Webpack 5 will likely come with one
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true // set to true if you want JS source maps
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	node: {
		__dirname: true,
	},
	resolve: {
		extensions: ['.js','.css', 'html']
	},
	module: {
		rules: [
			{
				// Transpiles ES6-8 into ES5
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				// Loads the javacript into html template provided.
				// Entry point is set below in HtmlWebPackPlugin in Plugins 
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						// options: { minimize: true }
					}
				]
			},
			{
				// Loads images into CSS and Javascript files
				test: /\.jpg$/,
				use: [{loader: 'url-loader'}]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: ['file-loader']
			},
			{
				// Loads CSS into a file when you import it via Javascript
				// Rules are set in MiniCssExtractPlugin
				test: /\.css$/,
				use: [
					'style-loader'        
				]
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					// fallback to style-loader in development
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/html/index.html',
			filename: './index.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/404.html',
			filename: './404.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/500.html',
			filename: './500.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/legal/legal.html',
			filename: './legal/legal.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/legal/term.html',
			filename: './legal/term.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/legal/return.html',
			filename: './legal/return.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/legal/privatePolicy.html',
			filename: './legal/privatePolicy.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new HtmlWebPackPlugin({
			template: './src/html/legal/cookiesPolicy.html',
			filename: './legal/cookiesPolicy.html',
			excludeChunks: ['server'],
			chunks: ['main'],
			minify: {
				collapseWhitespace: false,
				removeComments: true,
				removeAttributeQuotes: false
			}
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css'
		})
	]
};
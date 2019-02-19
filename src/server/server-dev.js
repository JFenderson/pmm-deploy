// lt --port 8000 to open in localtunnnel
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import routes from './routes/index'
import cors from 'cors'
import '@babel/polyfill'
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, '../dist/index.html'),
            compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))
app.get('/', (_ ,res) => {
  res.sendFile(HTML_FILE);
})

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname + '../../src')));
app.use(express.static(path.join(__dirname + '../vendors')));
app.use('/api', routes);
app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), (err) => {
    if(err){
      console.log(err)
    }else{
      console.log(`server listening on ${app.get('port')}`)
    }
  });
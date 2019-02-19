// lt --port 8000 to open in localtunnnel
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import routes from './routes/index'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http';
import https from 'https';
import fs from 'fs';
import request from 'request'
import '@babel/polyfill'
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, '../dist/index.html'),
            compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');
app.use(cors())
app.use(express.static(path.join(__dirname + '../../src')));
app.use(express.static(path.join(__dirname + '../vendors')));
app.use('/api', routes);
app.get('*', (_ ,res) => {
  res.sendFile(HTML_FILE);
})
app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1' || ip === '165.227.8.2' || ip === '0.0.0.0') return true // trusted IPs
  else return false
})

// var ssl = {
//   key: fs.readFileSync('/etc/letsencrypt/live/pmmweekend.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/pmmweekend.com/fullchain.pem'),
//   ca: fs.readFileSync('/etc/letsencrypt/live/pmmweekend.com/chain.pem')
// }

http.createServer(app).listen(process.env.PORT || 5000);
// https.createServer(app).listen(process.env.PORT || 3);

// app.set('port', 3000)
// app.listen(app.get('port'), '0.0.0.0', (err) => {
//     if(err){
//       console.log(err)
//     }else{
//       console.log(`server listening on ${app.get('port')}`)
//     }
//   });
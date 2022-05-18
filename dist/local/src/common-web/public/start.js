/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const {createProxyMiddleware} = require('http-proxy-middleware');
const config = require('./config');

const {proxy, port} = config || {};
const serverUrl = `http://localhost:${port}`;
const staticPath = path.join(__dirname, './client');

const app = express();
Object.keys(proxy).forEach((key) => {
  app.use(key, createProxyMiddleware(proxy[key]));
});
app.use('/client', express.static(staticPath<%= platform==='ssr'?', {fallthrough: false}':'' %>));

/*# if:ssr #*/
const serverBundle = require('./server/main');
const errorHandler = (e, res) => {
  if (e.code === 'ELIX.ROUTE_REDIRECT') {
    res.redirect(e.detail);
  } else {
    res.status(500).end(e.toString());
  }
};

app.use((req, res) => {
  try {
    serverBundle
      .default(req, res)
      .then((str) => {
        res.end(str);
      })
      .catch((e) => errorHandler(e, res));
  } catch (e) {
    errorHandler(e, res);
  }
});
/*# else #*/
const fallback = require('express-history-api-fallback');
app.use(fallback('index.html', {root: staticPath}));
/*# end #*/

app.listen(port, () =>
  console.info(`\n \n.....${new Date().toLocaleString()} starting ${chalk.redBright('Server')} on ${chalk.underline.redBright(serverUrl)} \n`)
);

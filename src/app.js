const Koa = require('koa');
const middleware = require('./middleware');
const routes = require('./routes');

const app = new Koa();

app.use(middleware);
app.use(routes);

module.exports = app;

const Koa = require('koa');
const middleware = require('./middleware');
const routes = require('./routes');

const app = new Koa();
require('koa-qs')(app);

app.use(middleware);
app.use(routes);

module.exports = app;

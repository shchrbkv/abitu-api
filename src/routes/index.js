const Router = require('koa-router');
const unisRoutes = require('./unisRoutes');
const programsRoutes = require('./programsRoutes');

apiRouter = new Router();

// apiRouter.prefix('/api');
apiRouter.use('/unis', unisRoutes);
apiRouter.use('/programs', programsRoutes);

module.exports = apiRouter.routes();

const Router = require('koa-router');
const unisRoutes = require('./unisRoutes');
const programsRoutes = require('./programsRoutes');
const applicationsRoutes = require('./applicationsRoutes');

apiRouter = new Router();

// apiRouter.prefix('/api');
apiRouter.use('/unis', unisRoutes);
apiRouter.use('/programs', programsRoutes);
apiRouter.use('/applications', applicationsRoutes);

module.exports = apiRouter.routes();

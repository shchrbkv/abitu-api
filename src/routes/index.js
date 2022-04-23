const Router = require('koa-router');
const unisRoutes = require('./unisRoutes');
const programsRoutes = require('./programsRoutes');
const applicationsRoutes = require('./applicationsRoutes');
const usersRoutes = require('./usersRoutes');
const authRoutes = require('./authRoutes');

apiRouter = new Router();

// apiRouter.prefix('/api');
apiRouter.use('/unis', unisRoutes);
apiRouter.use('/programs', programsRoutes);
apiRouter.use('/applications', applicationsRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/auth', authRoutes);

module.exports = apiRouter.routes();

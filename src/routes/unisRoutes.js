const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

router.get('/', controllers.unis.getAll).get('/:uni', controllers.unis.getById);

const programsRoutes = require('./programsRoutes');
router.use('/:uni/programs', programsRoutes);

// Authenticated
router.use(clearance.auth);

// Admin zone
router.use(clearance.for('admin')).post('/', controllers.unis.create).delete('/:uni', controllers.unis.deleteById);

// Restricted zone
router.use(clearance.for('editor')).patch('/:uni', controllers.unis.updateById);

module.exports = router.routes();

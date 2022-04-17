const Router = require('koa-router');
const controllers = require('../controllers');

const router = new Router();

router.get('/', controllers.unis.getAll).post('/', controllers.unis.create);
router
	.get('/:uni', controllers.unis.getById)
	.patch('/:uni', controllers.unis.updateById)
	.delete('/:uni', controllers.unis.deleteById);

const programsRoutes = require('./programsRoutes');

router.use('/:uni/programs', programsRoutes);

module.exports = router.routes();

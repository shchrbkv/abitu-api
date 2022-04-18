const Router = require('koa-router');
const controllers = require('../controllers');

const router = new Router();

router.get('/', controllers.applications.getAll).post('/', controllers.applications.create);
router
	.get('/:application', controllers.applications.getById)
	.patch('/:application', controllers.applications.updateById)
	.delete('/:application', controllers.applications.deleteById);

module.exports = router.routes();

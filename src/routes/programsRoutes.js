const Router = require('koa-router');
const controllers = require('../controllers');

const router = new Router();

router.get('/', controllers.programs.getAll).post('/', controllers.programs.create);
router
	.get('/:program', controllers.programs.getById)
	.patch('/:program', controllers.programs.updateById)
	.delete('/:program', controllers.programs.deleteById);

module.exports = router.routes();

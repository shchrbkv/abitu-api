const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

// Restricted zone
router.use(clearance.auth, clearance.for('admin'));
router.get('/', controllers.users.getAll).post('/', controllers.users.create);
router
	.get('/:user', controllers.users.getById)
	.patch('/:user', controllers.users.updateById)
	.delete('/:user', controllers.users.deleteById);

module.exports = router.routes();

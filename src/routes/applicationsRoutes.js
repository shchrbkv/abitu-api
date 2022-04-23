const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

router.get('/', controllers.applications.getAll).get('/:application', controllers.applications.getById);

// Authenticated
router.use(clearance.auth);

// Restricted zone
router
	.use(clearance.for('editor', 'admin'))
	.post('/', controllers.applications.create)
	.patch('/:application', controllers.applications.updateById)
	.delete('/:application', controllers.applications.deleteById);

module.exports = router.routes();

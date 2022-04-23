const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

router.get('/', controllers.programs.getAll).get('/:program', controllers.programs.getById);

const applicationsRoutes = require('./applicationsRoutes');
router.use('/:program/applications', applicationsRoutes);

// Authenticated
router.use(clearance.auth);

// Restricted zone
router
	.use(clearance.for('editor', 'admin'))
	.post('/', controllers.programs.create)
	.patch('/:program', controllers.programs.updateById)
	.delete('/:program', controllers.programs.deleteById);

module.exports = router.routes();

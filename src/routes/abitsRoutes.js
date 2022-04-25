const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

router.get('/', controllers.abits.getAll).get('/:abit', controllers.abits.getById);

// Authenticated
router.use(clearance.auth);

// Restricted zone
router.patch('/:abit', controllers.abits.updateById);

router.use(clearance.for('admin')).post('/', controllers.abits.create).delete('/:abit', controllers.abits.deleteById);

module.exports = router.routes();

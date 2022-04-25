const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

router.get('/', controllers.auth.refresh).put('/', controllers.auth.login).post('/', controllers.auth.register);

// Authenticated
router.use(clearance.auth);
router.delete('/', controllers.auth.logout);

router
	.get('/me', controllers.auth.getMe)
	.patch('/me', controllers.auth.updateMe)
	.delete('/me', controllers.auth.deleteMe);

module.exports = router.routes();

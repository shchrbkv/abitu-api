const Router = require('koa-router');
const controllers = require('../controllers');
const { clearance } = require('../utils');

const router = new Router();

router.get('/', controllers.auth.refresh).post('/', controllers.auth.login);

router.use(clearance.auth).delete('/', controllers.auth.logout);

module.exports = router.routes();

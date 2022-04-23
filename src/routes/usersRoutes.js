const Router = require('koa-router');
const controllers = require('../controllers');

const router = new Router();

router.get('/', controllers.users.getAll).post('/', controllers.users.register);

module.exports = router.routes();

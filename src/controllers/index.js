const unisController = require('./unisController');
const programsController = require('./programsController');
const applicationsController = require('./applicationsController');
const usersController = require('./usersController');
const abitsController = require('./abitsController');
const authController = require('./authController');

module.exports = {
	unis: unisController,
	programs: programsController,
	applications: applicationsController,
	users: usersController,
	abits: abitsController,
	auth: authController,
};

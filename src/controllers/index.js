const unisController = require('./unisController');
const programsController = require('./programsController');
const applicationsController = require('./applicationsController');

module.exports = {
	unis: unisController,
	programs: programsController,
	applications: applicationsController,
};

const compose = require('koa-compose');
const helmet = require('helmet');
const koaBody = require('koa-body');
const errorHandler = require('./errorHandler');

const stack = [];

stack.push(errorHandler);

//stack.push(helmet());

stack.push(koaBody());

module.exports = compose(stack);

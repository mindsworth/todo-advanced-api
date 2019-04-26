import config from 'config';
import apiAuth from '../middleware/api'
import todos from './todo/todo.route';
import errorHandler from '../setups/errors'
const prefix = config.get('api.prefix');
import Q from 'q';
/**
 * The routes will add all the application defined routes
 * @param {app} app The app is an instance of an express application
 * @return {Promise<void>}
 */
export default (app) => {
	app.use(prefix, apiAuth);
	app.use(prefix, todos);
	// app.use(prefix, apiAuth);
	// check url for state codes and api version


	app.use(errorHandler);
	return Q.resolve(app);
};

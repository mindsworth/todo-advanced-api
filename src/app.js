import config from 'config';
import databaseInitialization from './setups/database'
import loadExpress from './setups/express';
import loadRoutes from './api';
import serverSetup from './setups/server'
import Q from 'q';

export default databaseInitialization(config)
	.then(() => {
		return loadExpress;
	})
	.then((app) => {
		return loadRoutes(app);
	})
	.then(async (app) => {
		const server = await serverSetup(app);
		console.log(`Application listening on ${config.get('app.baseUrl')},
		 Environment => ${config.util.getEnv('NODE_ENV')} ${server}`);
		return Q.resolve(app);
	}, err => {
		console.log('There was an un catch error : ');
		console.error(err);
	});
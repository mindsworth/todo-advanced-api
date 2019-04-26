import http from 'http';
import config from 'config';

export default async app => {
	const server = http.createServer(app);
	return server.listen(config.get('app.port'));
};

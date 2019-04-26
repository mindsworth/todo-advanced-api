import mongoose from 'mongoose';
import Q from 'q';

export default config => {
	// mongoose.Promise = Q.Promise;
	mongoose.connection.on('disconnected', function () {
		console.log('Mongoose connection to mongodb shell disconnected');
	});
	// Connect to MongoDb
	return mongoose
		.connect(config.get('database.url'), {
			useCreateIndex: true,
			useNewUrlParser: true
		})
		.then(() => {
			console.log('Mongoose connected to mongo shell.');
			console.log('mongodb url ', config.get('database.url'));
		}, err => {
			console.log('Mongoose could not connect to mongo shell!');
			console.log(err);
		});
};

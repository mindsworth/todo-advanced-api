import QueryParser from '../../utils/query-parser';
import AppError from '../../utils/app-error';
import { BAD_REQUEST, NOT_FOUND, OK } from '../../utils/status-codes';
import lang from '../../lang';
import _ from 'lodash';
import Pagination from '../../utils/pagination';

/**
 * The App controller class where other controller inherits or
 * overrides pre defined and existing properties
 */

class AppController {
	/**
	 * @param {Model} model The default model object
	 * for the controller. Will be required to create
	 * an instance of the controller
	 */
	constructor(model) {
		if (new.target === AppController) {
			throw new TypeError('Cannot construct Abstract instances directly');
		}
		if (model) {
			this.model = model;
			this.lang = lang.get(model.collection.collectionName);
		}

		this.id = this.id.bind(this);
		this.create = this.create.bind(this);
		this.findOne = this.findOne.bind(this);
		this.find = this.find.bind(this);
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
	}


	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {Function} next The callback to the next program handler
	 * @param {String} id The id from the url parameter
	 * @return {Object} res The response object
	 */
	async id(req, res, next, id) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		try {
			let object = await this.model.findOne({_id: id, deleted: false, ...queryParser.query}).exec();
			if (object) {
				req.object = object;
				return next();
			}
			const appError = new AppError(this.lang.not_found, NOT_FOUND);
			return next(appError);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {Function} next The callback to the next program handler
	 * @return {Object} The response object
	 */
	async findOne(req, res, next) {
		let object = req.object;
		req.response = {
			model: this.model,
			code: OK,
			value: await object.save()
		};
		return next();
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {Function} next The callback to the next program handler
	 * @return {Object} res The response object
	 */
	async create(req, res, next) {
		const obj = req.body;
		const validate = this.model.getValidator().create(obj);
		if (!validate.validated) {
			const error = new AppError(lang.get('error').inputs, BAD_REQUEST, validate.validator.errors.all());
			return next(error);
		}
		try {
			const processor = this.model.getProcessor();
			let object = processor.createNewObject(this.model, obj);
			req.response = {
				model: this.model,
				code: OK,
				value: await object
			};
			return next();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {Function} next The callback to the next program handler
	 * @return {Object} The response object
	 */
	async find(req, res, next) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		const pagination = new Pagination(req.originalUrl);
		const processor = this.model.getProcessor();
		const {query, countQuery} = processor.buildModelQueryObject(this.model, pagination, queryParser);
		try {
			const [objects, count] = await Promise.all([
				query.exec(),
				countQuery.exec(),
			]);
			req.response = {
				model: this.model,
				code: OK,
				value: objects,
				count,
				queryParser,
				pagination
			};
			return next();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {Function} next The callback to the next program handler
	 * @return {Object} res The response object
	 */
	async update(req, res, next) {
		let object = req.object;
		const obj = req.body;
		const validate = this.model.getValidator().update(obj);
		if (!validate.validated) {
			const error = new AppError(lang.get('error').no_update_input, BAD_REQUEST, validate.validator.errors.all());
			return next(error);
		}
		const processor = this.model.getProcessor();
		object = await processor.updateObject(this.model, object, obj);
		try {
			req.response = {
				model: this.model,
				code: OK,
				message: this.lang.create,
				value: await object.save()
			};
			return next();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {Function} next The callback to the next program handler
	 * @return {Object} The response object
	 */
	async delete(req, res, next) {
		let object = req.object;
		try {
			if (this.model.config['softDelete']) {
				_.extend(object, {deleted: true});
				object = await object.save();
			} else {
				object = await object.remove();
			}
			req.response = {
				model: this.model,
				code: OK,
				value: {_id: object._id},
				message: this.lang.deleted
			};
			return next();
		} catch (err) {
			return next(err);
		}
	}
}

export default AppController;


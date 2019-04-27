import AppResponse from '../../utils/app-response';
import _ from 'lodash';

/**
 * The app processor class
 */
export class AppProcessor {
	/**
	 * @param {Object} options required for response
	 * @return {Promise<Object>}
	 */
	async getApiClientResponse({model, value, code, message = "successful", queryParser, pagination, count}) {
		console.log('query : ', queryParser.query);
		const meta = AppResponse.getSuccessMeta();
		_.extend(meta, {status_code: code});
		if (message) {
			meta.message = message;
		}
		if (queryParser && queryParser.population) {
			value = await model.populate(value, queryParser.population);
		}
		if (pagination && !queryParser.getAll) {
			pagination.totalCount = count;
			if (pagination.morePages(count)) {
				pagination.next = pagination.current + 1;
			}
			meta.pagination = pagination.done();
		}
		return AppResponse.format(meta, value);
	}

	/**
	 * @param {Object} model The schema model
	 * @param {Object} pagination The pagination object
	 * @param {Object} queryParser The query parser
	 * @return {Object}
	 */
	buildModelQueryObject(model, pagination, queryParser = null) {
		let query = model.find(queryParser.query);
		if (queryParser.search && model.searchQuery(queryParser.search).length > 0) {
			const searchQuery = model.searchQuery(queryParser.search);
			queryParser.query = {
				$or: [...searchQuery],
				...queryParser.query
			};
			query = model.find({...queryParser.query});
		}
		if (queryParser.population) {
			query = query.populate(queryParser.population);
		}
		if (!queryParser.getAll) {
			query = query.skip(pagination.skip)
				.limit(pagination.perPage);
		}
		query = query.sort(
			(pagination && pagination.sort) ?
				Object.assign(pagination.sort, {createdAt: -1}) : '-createdAt');
		return {
			query: query.select(queryParser.selection),
			countQuery: model.countDocuments(queryParser.query)
		};
	}

	/**
	 * @param {Function} model The model
	 * @param {Object} obj The payload object
	 * @return {Object}
	 */
	createNewObject(model, obj) {
		const tofill = model.fillables;
		const allowedPayload = _.pick(obj, ...tofill);
		return new model(allowedPayload).save();
	}

	/**
	 * @param {Function} model The model
	 * @param {Object} current The payload object
	 * @param {Object} obj The payload object
	 * @return {Object}
	 */
	updateObject(model, current, obj) {
		const tofill = model.fillables;
		const allowedPayload = _.pick(obj, ...tofill);
		_.extend(current, allowedPayload);
		return current.save();
	}
}

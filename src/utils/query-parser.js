import _ from 'lodash';

/**
 * The QueryParser class
 */
class QueryParser {
	/**
	 * @constructor
	 * @param {Object} query This is a query object of the request
	 */
	constructor(query) {
		this.initialize(query);
		const excluded = ['per_page', 'page', 'limit', 'sort', 'all', 'includes', 'selection', 'population', 'search'];
		// omit special query string keys from query before passing down to the model for filtering
		query = _.omit(query, ...excluded);
		// Only get collection that has not been virtually deleted.
		query = _.extend(query, {deleted: false});
		this._query = query;
		Object.assign(this, query); // TODO: Show emma
	}

	/**
	 *  Initialise all the special object required for the find query
	 */
	initialize(query) {
		if (query.population) {
			this.population = query.population;
		}
		if (query.selection) {
			this.selection = query.selection;
		}
		if (query.search) {
			this._search = query.search;
		}
	}

	/**
	 * @return {Object} get the parsed query
	 */
	get query() {
		return this._query;
	}

	/**
	 * @param {Object} query set the parsed query
	 */
	set query(query) {
		this._query = query;
	}

	/**
	 * @return {Object} get the parsed query
	 */
	get search() {
		return this._search;
	}

	/**
	 * @return {Object} get the selection property
	 */
	get selection() {
		if (this._selection) {
			return this._selection;
		}
		return [];
	}

	/**
	 * @param {Object} value is the population object
	 */
	set selection(value) {
		console.log('value : ', value);
		this._selection = null;
		if (!_.isObject(value)) {
			try {
				this._selection = JSON.parse(value.toString()).join(' ');
			} catch (e) {
				console.log(e);
			}
		}
	}

	/**
	 * @return {Object} get the population object for query
	 */
	get population() {
		if (this._population) {
			return this._population;
		}
		return [];
	}

	/**
	 * @param {Object} value is the population object
	 */
	set population(value) {
		this._population = value;
		if (!_.isObject(value)) {
			try {
				this._population = JSON.parse(value.toString());
			} catch (e) {
				console.log(e);
			}
		}
	}

	/**
	 * @return {Object} get the sort property
	 */
	get sort() {
		if (this._sort) {
			return this._sort;
		}
		return '-createdAt';
	}

	/**
	 * @return {Boolean} get the value for all data request
	 */
	get getAll() {
		return this._all;
	}
}

/**
 * @typedef QueryParser
 */

export default QueryParser;

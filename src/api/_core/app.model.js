import Validator from 'validatorjs';
import util from 'util';
import { Schema } from 'mongoose';
import AppValidation from './app.validation';
import { AppProcessor } from './app.processor';

/**
 * The Base types object where other types inherits or
 * overrides pre defined and static methods
 */
function AppSchema(...args) {
	Schema.apply(this, args);
	/**
	 * @param {Object} obj The object to perform validation on
	 * @return {Validator} The validator object with the specified rules.
	 */
	this.statics.validateCreate = (obj = {}) => {
		let rules = {};
		return new Validator(obj, rules);
	};

	/**
	 * @return {Object} The validator object with the specified rules.
	 */
	this.statics.uniques = function () {
		return {};
	};

	/**
	 * @return {Object} The validator object with the specified rules.
	 */
	this.statics.returnIfFound = function () {
		return false;
	};

	/**
	 * @return {Object} The validator object with the specified rules.
	 */
	this.statics.getValidator = () => {
		return new AppValidation();
	};

	/**
	 * @return {Object} The processor class instance object
	 */
	this.statics.getProcessor = () => {
		return new AppProcessor();
	};
	/**
	 * @return {Object} The validator object with the specified rules.
	 */
	this.statics.getValidator = () => {
		return new AppValidation();
	};
}

util.inherits(AppSchema, Schema);
/**
 * @typedef BaseSchema
 */
export default AppSchema;

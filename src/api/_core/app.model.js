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

	this.statics.softDelete = false;
	this.statics.uniques = [];
	this.statics.fillables = [];

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
}

util.inherits(AppSchema, Schema);
/**
 * @typedef AppSchema
 */
export default AppSchema;

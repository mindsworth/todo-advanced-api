import Validator from 'validatorjs';

/**
 * The App Validation class
 */
class AppValidation {

	create(obj) {
		const rules = {};
		const validator = new Validator(obj, rules);
		return {
			validator,
			validated: validator.passes()
		};
	}

	update(obj) {
		const rules = {};
		const validator = new Validator(obj, rules);
		return {
			validator,
			validated: validator.passes()
		};
	}
}

export default AppValidation

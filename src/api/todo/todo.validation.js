import Validator from 'validatorjs';
import AppValidation from '../_core/app.validation';

/**
 * The App Validation class
 */
class TodoValidation extends AppValidation {

	create(obj) {
		const rules = {
			'title': 'string|required',
			'description': 'string|required',
		};
		const validator = new Validator(obj, rules);
		return {
			validator,
			validated: validator.passes()
		};
	}
}

export default TodoValidation

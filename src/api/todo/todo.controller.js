import AppController from '../_core/app.controller';

/**
 * TodoController class extends from app controller
 */
class TodoController extends AppController {
	/**
	 * @param {Model} name The name property is inherited
	 * from the parent
	 */
	constructor(name) {
		super(name);
	}
}

export default TodoController;

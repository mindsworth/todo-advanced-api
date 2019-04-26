import { Router } from 'express';
import TodoModel from './todo.model';
import response from '../../middleware/response';
import TodoController from './todo.controller';

const router = Router();
const todoCtrl = new TodoController(TodoModel);

router.route('/todos')
	.post(todoCtrl.create, response)
	.get(todoCtrl.find, response);
router.param('id', todoCtrl.id);
router.route('/todos/:id')
	.get(todoCtrl.findOne, response)
	.put(todoCtrl.update, response)
	.delete(todoCtrl.delete, response);
export default router;

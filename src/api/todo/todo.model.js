import mongoose from 'mongoose';
import AppSchema from '../_core/app.model';
import TodoValidation from './todo.validation';

const TodoSchema = new AppSchema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	active: {type: Boolean, default: true},
	deleted: {
		type: Boolean,
		default: false,
		select: false,
	},
}, {
	timestamps: true,
});

/**
 * @return {Object} The validator object with the specified rules.
 */
TodoSchema.statics.getValidator = () => {
	return new TodoValidation();
};

/**
 * @return {Array} return an array of search query for an index search
 */
TodoSchema.statics.searchQuery = (q) => {
	const regex = new RegExp(q);
	return [
		{'title': {$regex: regex, $options: 'i'}},
		{'description': {$regex: regex, $options: 'i'}}
	];
};

TodoSchema.statics.config = {
	softDelete: false,
	uniques: ['title'],
	fillables: ['title', 'description', 'active'],
};

/**
 * @typedef TodoSchema
 */
export default mongoose.model('Todo', TodoSchema);

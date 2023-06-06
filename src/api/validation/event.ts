import { schemas } from '../api.client';

export const CreateEventBody = schemas.createEvent_Body
	.refine((value) => value.min_amount <= value.max_amount, {
		message: 'Min amount must be less than max amount',
		path: ['min_amount']
	})
	.refine((value) => value.start_time <= value.end_time, {
		message: 'Start time must be less than end time',
		path: ['start_time']
	})
	.refine(
		(value) =>
			value.category.trim().length > 0 &&
			value.category.trim().toUpperCase() !== 'All categories'.toUpperCase() &&
			value.category.trim().toUpperCase() !== 'All category'.toUpperCase() &&
			value.category.trim().toUpperCase() !== 'All'.toUpperCase(),
		{
			message: 'Invalid category',
			path: ['category']
		}
	);

export const UpdateEventBody = schemas.updateEvent_Body
	.refine((value) => value.min_amount <= value.max_amount, {
		message: 'Min amount must be less than max amount',
		path: ['min_amount']
	})
	.refine((value) => value.start_time <= value.end_time, {
		message: 'Start time must be less than end time',
		path: ['start_time']
	})
	.refine(
		(value) =>
			value.category.trim().length > 0 &&
			value.category.trim().toUpperCase() !== 'All categories'.toUpperCase() &&
			value.category.trim().toUpperCase() !== 'All category'.toUpperCase() &&
			value.category.trim().toUpperCase() !== 'All'.toUpperCase(),
		{
			message: 'Invalid category',
			path: ['category']
		}
	);

import { schemas } from '../api.client';

export const CreateEventBody = schemas.createEvent_Body
	.refine((value) => value.min_amount <= value.max_amount, {
		message: 'Min amount must be less than max amount',
		path: ['min_amount']
	})
	.refine((value) => value.start_time <= value.end_time, {
		message: 'Start time must be less than end time',
		path: ['start_time']
	});

export const UpdateEventBody = schemas.updateEvent_Body
	.refine((value) => value.min_amount <= value.max_amount, {
		message: 'Min amount must be less than max amount',
		path: ['min_amount']
	})
	.refine((value) => value.start_time <= value.end_time, {
		message: 'Start time must be less than end time',
		path: ['start_time']
	});

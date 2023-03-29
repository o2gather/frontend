import { z } from 'zod';

const EventPrototypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.date(),
	end_time: z.date(),
	min_people: z.number().min(2),
	max_people: z.number().min(2),
	invited: z.array(z.string()),
	member_ids: z.array(z.number()),
	message_ids: z.array(z.number())
});

export const EventSchema = EventPrototypeSchema.refine(
	(data) => data.max_people >= data.min_people,
	{
		message: 'Max people must be greater than min people',
		path: ['max_people']
	}
).refine((data) => data.start_time < data.end_time, {
	message: 'Start time must be before end time',
	path: ['start_time']
});

export type Event = z.infer<typeof EventSchema>;

export const EventPayloadSchema = EventPrototypeSchema.omit({
	id: true,
	member_ids: true,
	message_ids: true
})
	.refine((data) => data.max_people >= data.min_people, {
		message: 'Max people must be greater than min people',
		path: ['max_people']
	})
	.refine((data) => data.start_time < data.end_time, {
		message: 'Start time must be before end time',
		path: ['start_time']
	});

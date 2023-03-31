import { z } from 'zod';
import { MemberSchema } from './member';

export const EventSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.date(),
	end_time: z.date(),
	min_amount: z.number().min(2),
	max_amount: z.number(),
	members: z.array(MemberSchema)
});

export type Event = z.infer<typeof EventSchema>;

export const EventPayloadSchema = EventSchema.omit({
	id: true,
	members: true
})
	.and(
		z.object({
			invited: z.array(z.string().email())
		})
	)
	.refine((data) => data.max_amount >= data.min_amount, {
		message: 'Max amount must be greater than min amount',
		path: ['max_amount']
	})
	.refine((data) => data.start_time < data.end_time, {
		message: 'Start time must be before end time',
		path: ['start_time']
	});

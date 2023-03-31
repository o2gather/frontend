import { z } from 'zod';

export const MessageSchema = z.object({
	id: z.string().uuid(),
	content: z.string(),
	name: z.string(),
	created_at: z.date(),
	event_id: z.string().uuid()
});

export type Message = z.infer<typeof MessageSchema>;

export const MessagePayloadSchema = MessageSchema.pick({ content: true });

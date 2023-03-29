import { z } from 'zod';

export const MessageSchema = z.object({
	id: z.number(),
	content: z.string(),
	author_id: z.number(),
	created_at: z.date()
});

export type Message = z.infer<typeof MessageSchema>;

export const MessagePayloadSchema = MessageSchema.omit({ id: true, created_at: true });

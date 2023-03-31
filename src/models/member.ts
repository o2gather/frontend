import { z } from 'zod';

export const MemberSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	phone: z.string().regex(/^09\d{8}$/),
	amount: z.number().min(1)
});

export type Member = z.infer<typeof MemberSchema>;

export const MemberPayloadSchema = MemberSchema.pick({ amount: true });

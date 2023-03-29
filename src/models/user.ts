import { z } from 'zod';

export const UserSchema = z.object({
	id: z.number().optional(),
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	password: z.string(),
	phone: z.string(),
	userStatus: z.number()
});

export type User = z.infer<typeof UserSchema>;

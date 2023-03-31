import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string().uuid(),
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	userStatus: z.number()
});

export type User = z.infer<typeof UserSchema>;

export const UserPayloadSchema = UserSchema.omit({ id: true });

export const AccountInfoSchema = UserSchema.pick({ username: true, password: true });

import { z } from 'zod';

export const AccountInfoSchema = z.object({
	username: z.string(),
	password: z.string()
});

export type AccountInfo = z.infer<typeof AccountInfoSchema>;

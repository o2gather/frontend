import { rest } from 'mswx';

export const createDelayMiddleware = (ms = 500) =>
	rest.middleware(async (req, res, ctx, next) => {
		await new Promise((resolve) => setTimeout(resolve, ms));
		return next();
	});

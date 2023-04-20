import { rest } from 'mswx';

export const createAuthMiddleware = (token = '123456') =>
	rest.middleware((req, res, ctx, next) => {
		return next();

		// disable auth middleware
		const authorization = req.headers.get('Authorization');
		if (authorization !== `Bearer ${token}`) {
			return res(
				ctx.status(401),
				ctx.json({
					message: 'Unauthorized'
				})
			);
		}

		return next();
	});

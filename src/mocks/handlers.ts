import { rest } from 'mswx';

rest.config.API_PREFIX = '/api/v1';

const AuthMiddleware = rest.middleware((req, res, ctx, next) => {
	const authorization = req.headers.get('Authorization');
	if (!authorization) {
		return res(
			ctx.status(401),
			ctx.json({
				message: 'Unauthorized'
			})
		);
	}

	return next();
});

const userHandlers = [
	rest.get('/user', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				id: 1,
				name: 'John Doe'
			})
		);
	})
];

export const handlers = [...userHandlers.map(AuthMiddleware)];

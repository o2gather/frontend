import { rest } from 'mswx';
import { UserSchema } from '../models/user';
import { ZodError } from 'zod';

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

const userWithoutAuthorizationHandlers = [
	rest.post('/user', async (req, res, ctx) => {
		const payload = await req.json();

		try {
			UserSchema.parse(payload);

			return res(ctx.status(201));
		} catch (error) {
			if (error instanceof ZodError) {
				return res(
					ctx.status(400),
					ctx.json({
						message: 'Bad request',
						errors: error.errors
					})
				);
			}

			return res(
				ctx.status(500),
				ctx.json({
					message: 'Internal server error'
				})
			);
		}
	}),
	rest.post('/user/login', async (req, res, ctx) => {
		const payload = await req.json();

		try {
			UserSchema.parse(payload);

			return res(ctx.status(200));
		} catch (error) {
			if (error instanceof ZodError) {
				return res(
					ctx.status(400),
					ctx.json({
						message: 'Bad request',
						errors: error.errors
					})
				);
			}

			return res(
				ctx.status(500),
				ctx.json({
					message: 'Internal server error'
				})
			);
		}
	})
];

const userWithAuthorizationHandlers = [
	rest.post('/user/logout', async (req, res, ctx) => {
		return res(ctx.status(200));
	}),
	rest.get('/user/:username', async (req, res, ctx) => {
		const { username } = req.params;

		return res(
			ctx.status(200),
			ctx.json({
				id: 1,
				username,
				firstName: 'Test',
				lastName: 'User',
				email: 'test@gmail.com',
				password: 'test',
				phone: '1234567890',
				userStatus: 1
			})
		);
	}),
	rest.patch('/user/:username', async (req, res, ctx) => {
		try {
			UserSchema.parse(await req.json());

			return res(ctx.status(200));
		} catch (error) {
			if (error instanceof ZodError) {
				return res(
					ctx.status(400),
					ctx.json({
						message: 'Bad request',
						errors: error.errors
					})
				);
			}
		}
	}),
	rest.delete('/user/:username', async (req, res, ctx) => {
		const { username } = req.params;

		if (username !== 'test') {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'User not found'
				})
			);
		}

		return res(ctx.status(200));
	})
];

export const handlers = [
	...userWithoutAuthorizationHandlers,
	...userWithAuthorizationHandlers.map(AuthMiddleware)
];

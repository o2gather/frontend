import { rest } from 'mswx';
import { UserSchema, type User } from '../models/user';
import { ZodError } from 'zod';
import { AccountInfoSchema } from '../models/account-info';

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

const mockUsers: User[] = [
	{
		id: 1,
		username: 'test',
		firstName: 'Test',
		lastName: 'User',
		email: 'test@gmail.com',
		password: 'test',
		phone: '1234567890',
		userStatus: 1
	},
	{
		id: 2,
		username: 'test2',
		firstName: 'Test2',
		lastName: 'User2',
		email: 'test2@gmail.com',
		password: 'test2',
		phone: '1234567890',
		userStatus: 1
	}
];

const userWithoutAuthorizationHandlers = [
	rest.post('/user', async (req, res, ctx) => {
		try {
			const user = UserSchema.parse(await req.json());
			mockUsers.push(user);

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
		try {
			const accountInfo = AccountInfoSchema.parse(await req.json());
			const user = mockUsers.find((user) => user.username === accountInfo.username);

			if (!user) {
				return res(
					ctx.status(404),
					ctx.json({
						message: 'User not found'
					})
				);
			}

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

		const user = mockUsers.find((user) => user.username === username);

		if (!user) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'User not found'
				})
			);
		}

		return res(ctx.status(200), ctx.json(user));
	}),
	rest.patch('/user/:username', async (req, res, ctx) => {
		const { username } = req.params;

		const user = mockUsers.find((user) => user.username === username);

		if (!user) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'User not found'
				})
			);
		}

		try {
			const newData = UserSchema.parse(await req.json());

			Object.assign(user, newData);

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

		const userIndex = mockUsers.findIndex((user) => user.username === username);

		if (userIndex === -1) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'User not found'
				})
			);
		}

		mockUsers.splice(userIndex, 1);

		return res(ctx.status(200));
	})
];

export const handlers = [
	...userWithoutAuthorizationHandlers,
	...userWithAuthorizationHandlers.map(AuthMiddleware)
];

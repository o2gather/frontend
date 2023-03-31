import { rest } from 'mswx';
import { AccountInfoSchema, UserPayloadSchema, UserSchema, type User } from '../models/user';
import { EventPayloadSchema, EventSchema, type Event } from '../models/event';
import { ZodError } from 'zod';
import { MessagePayloadSchema, type Message } from '../models/message';
import { v4 as uuidv4 } from 'uuid';
import { MemberPayloadSchema, type Member } from '../models/member';

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

const mockUsers: User[] = [];
const mockEvents: Event[] = [];
const mockMessages: Message[] = [];

const userWithoutAuthorizationHandlers = [
	rest.post('/register', async (req, res, ctx) => {
		try {
			const userPayload = UserPayloadSchema.parse(await req.json());

			const user: User = {
				id: uuidv4(),
				...userPayload
			};

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
	rest.post('/login', async (req, res, ctx) => {
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
	rest.post('/logout', async (req, res, ctx) => {
		return res(ctx.status(200));
	}),
	rest.get('/users/:user_id', async (req, res, ctx) => {
		const { user_id } = req.params;

		const user = mockUsers.find((user) => user.id === user_id);

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
	rest.patch('/users/:user_id', async (req, res, ctx) => {
		const { user_id } = req.params;

		const user = mockUsers.find((user) => user.id === user_id);

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
	rest.delete('/users/:user_id', async (req, res, ctx) => {
		const { user_id } = req.params;

		const userIndex = mockUsers.findIndex((user) => user.id === user_id);

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
	}),
	rest.get('/users/:user_id/events', async (req, res, ctx) => {
		const { user_id } = req.params;

		const user = mockUsers.find((user) => user.id === user_id);

		if (!user) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'User not found'
				})
			);
		}

		const events = mockEvents.filter((event) =>
			event.members.map((member) => member.email).includes(user.email)
		);

		return res(ctx.status(200), ctx.json(events));
	})
];

const eventHandlers = [
	rest.post('/events', async (req, res, ctx) => {
		try {
			const eventPayload = EventPayloadSchema.parse(await req.json());

			const event: Event = {
				id: uuidv4(),
				...eventPayload,
				members: []
			};

			mockEvents.push(event);

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
		}
	}),
	rest.get('/events', async (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(mockEvents));
	}),
	rest.get('/events/:event_id', async (req, res, ctx) => {
		const { event_id } = req.params;

		const event = mockEvents.find((event) => event.id === event_id);

		if (!event) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		return res(ctx.status(200), ctx.json(event));
	}),
	rest.patch('/events/:event_id', async (req, res, ctx) => {
		const { event_id } = req.params;

		const event = mockEvents.find((event) => event.id === event_id);

		if (!event) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		try {
			const newData: Event = EventSchema.parse(await req.json());

			Object.assign(event, newData);

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
	}),
	rest.delete('/events/:event_id', async (req, res, ctx) => {
		const { event_id } = req.params;

		const eventIndex = mockEvents.findIndex((event) => event.id === event_id);

		if (eventIndex === -1) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		mockEvents.splice(eventIndex, 1);

		return res(ctx.status(200));
	}),
	rest.put('/events/:event_id/join', async (req, res, ctx) => {
		const { event_id } = req.params;

		const event = mockEvents.find((event) => event.id === event_id);

		if (!event) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		// TODO: extract user info from token
		const user = mockUsers[0];

		const memberPayload = MemberPayloadSchema.parse(await req.json());
		const member: Member = {
			name: user.firstName + ' ' + user.lastName,
			...memberPayload,
			email: user.email,
			phone: user.phone
		};

		event.members.push(member);

		return res(ctx.status(200), ctx.json(event));
	}),
	rest.post('/events/:event_id/leave', async (req, res, ctx) => {
		const { event_id } = req.params;

		const event = mockEvents.find((event) => event.id === event_id);

		if (!event) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		// TODO: extract user info from token
		const user = mockUsers[0];

		const memberIndex = event.members.findIndex((member) => member.email === user.email);

		if (memberIndex === -1) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Member not found'
				})
			);
		}

		event.members.splice(memberIndex, 1);

		return res(ctx.status(200));
	}),
	rest.get('/events/:event_id/msgs', async (req, res, ctx) => {
		const { event_id } = req.params;

		const event = mockEvents.find((event) => event.id === event_id);

		if (!event) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		const messages = mockMessages.filter((message) => message.event_id === event_id);

		return res(ctx.status(200), ctx.json(messages));
	}),
	rest.post('/events/:event_id/msgs', async (req, res, ctx) => {
		const { event_id } = req.params;

		const event = mockEvents.find((event) => event.id === event_id);

		if (!event) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Event not found'
				})
			);
		}

		// TODO: extract user info from token
		const user = mockUsers[0];

		try {
			const messagePayload = MessagePayloadSchema.parse(await req.json());

			const message: Message = {
				id: uuidv4(),
				...messagePayload,
				name: user.firstName + ' ' + user.lastName,
				event_id: event_id as string,
				created_at: new Date()
			};

			mockMessages.push(message);

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
		}
	})
];

const categoriesHandlers = [
	rest.get('/categories', async (req, res, ctx) => {
		const categories = mockEvents.reduce((acc, event) => {
			if (!acc.includes(event.category)) {
				acc.push(event.category);
			}
			return acc;
		}, [] as string[]);

		return res(ctx.status(200), ctx.json(categories));
	})
];

export const handlers = [
	...userWithoutAuthorizationHandlers,
	...userWithAuthorizationHandlers.map(AuthMiddleware),
	...eventHandlers.map(AuthMiddleware),
	...categoriesHandlers.map(AuthMiddleware)
];

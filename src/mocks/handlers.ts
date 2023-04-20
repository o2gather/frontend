import { rest } from 'mswx';
import { AccountInfoSchema, UserPayloadSchema, UserSchema, type User } from '../models/user';
import { EventSchema, type Event } from '../models/event';
import { ZodError } from 'zod';
import { MessagePayloadSchema, type Message } from '../models/message';
import { v4 as uuidv4 } from 'uuid';
import { MemberPayloadSchema, type Member } from '../models/member';
import { api } from '../api';
import { createAuthMiddleware } from './middlewares/AuthMiddleware';
import { createDelayMiddleware } from './middlewares/DelayMiddleware';
import { schemas, type types } from '../api/api.client';
import { generateMock } from '@anatine/zod-mock';

const mockToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwicGFzc3dvcmQiOjc3Nzc3fQ.rvPiI2N1yNgMlJRFR11y4BXBVGGEMn4ypRzfivWAhhA';
const AuthMiddleware = createAuthMiddleware(mockToken);
const DelayMiddleware = createDelayMiddleware(500);

rest.config.API_PREFIX = import.meta.env.VITE_API_PREFIX;

const mockUsers: User[] = [];
const mockEvents: types['Event'][] = Array(10)
	.fill(0)
	.map(() => generateMock(schemas.Event));
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

			if (!user || user.password !== accountInfo.password) {
				return res(
					ctx.status(400),
					ctx.json({
						message: 'Invalid username or password'
					})
				);
			}

			return res(
				ctx.status(200),
				ctx.json({
					token: mockToken
				})
			);
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
			event.members?.map((member) => member.email).includes(user.email)
		);

		return res(ctx.status(200), ctx.json(events));
	})
];

const eventHandlers = [
	rest.define(api.getAllEvents, async (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(mockEvents));
	}),
	rest.define(api.createEvent, async (req, res, ctx) => {
		try {
			const eventPayload = schemas.createEvent_Body.parse(await req.json());

			const event: types['Event'] = {
				id: uuidv4(),
				...eventPayload,
				members: []
			};

			mockEvents.push(event);

			return res(ctx.status(200), ctx.json(event));
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
	rest.define(api.getEvent, async (req, res, ctx) => {
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

		event.members?.push(member);

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

		const memberIndex = event.members?.findIndex((member) => member.email === user.email) as number;

		if (memberIndex === -1) {
			return res(
				ctx.status(404),
				ctx.json({
					message: 'Member not found'
				})
			);
		}

		event.members?.splice(memberIndex, 1);

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
].map(DelayMiddleware);

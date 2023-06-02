import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const Event = z.object({
	id: z.string().uuid(),
	user_id: z.string().uuid().optional(),
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.number(),
	end_time: z.number(),
	min_amount: z.number().gte(2),
	max_amount: z.number().gte(2),
	amount: z.number().gte(0),
	members: z
		.array(
			z.object({
				name: z.string(),
				email: z.string().email(),
				phone: z.string().regex(/^09[0-9]{8}$/),
				amount: z.number()
			})
		)
		.optional()
});
const DefaultError = z.object({ message: z.string(), error_code: z.string().optional() });
const createEvent_Body = z.object({
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.number(),
	end_time: z.number(),
	min_amount: z.number().gte(2),
	max_amount: z.number().gte(2)
});
const updateEvent_Body = z.object({
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.number(),
	end_time: z.number(),
	min_amount: z.number().gte(2).optional(),
	max_amount: z.number().gte(2).optional()
});
const DefaultMsg = z.object({ message: z.string(), message_code: z.string().optional() });
const EventMsg = z.object({
	content: z.string(),
	user: z.object({ name: z.string(), avatar: z.string() }).optional(),
	created_at: z.number()
});
const User = z
	.object({
		id: z.string().uuid(),
		avatar: z.string(),
		name: z.string(),
		email: z.string().email(),
		phone: z.string().regex(/^09[0-9]{8}$/)
	})
	.partial();
const updateUserInfo_Body = z
	.object({
		avatar: z.string(),
		name: z.string(),
		email: z.string().email(),
		phone: z.string().regex(/^09[0-9]{8}$/)
	})
	.partial();

export type Event = z.infer<typeof Event>;
export type DefaultError = z.infer<typeof DefaultError>;
export type createEvent_Body = z.infer<typeof createEvent_Body>;
export type updateEvent_Body = z.infer<typeof updateEvent_Body>;
export type DefaultMsg = z.infer<typeof DefaultMsg>;
export type EventMsg = z.infer<typeof EventMsg>;
export type User = z.infer<typeof User>;
export type updateUserInfo_Body = z.infer<typeof updateUserInfo_Body>;

export const schemas = {
	Event,
	DefaultError,
	createEvent_Body,
	updateEvent_Body,
	DefaultMsg,
	EventMsg,
	User,
	updateUserInfo_Body
};

const endpoints = makeApi([
	{
		method: 'get',
		path: '/categories',
		alias: 'getCategories',
		description: `取得所有類別`,
		requestFormat: 'json',
		response: z.array(z.unknown()),
		errors: [
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/events',
		alias: 'getAllEvents',
		description: `取得所有團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'category',
				type: 'Query',
				schema: z.string().optional()
			},
			{
				name: 'search',
				type: 'Query',
				schema: z.string().optional()
			}
		],
		response: z.array(Event),
		errors: [
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'post',
		path: '/events',
		alias: 'createEvent',
		description: `新增團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				description: `新增團購`,
				type: 'Body',
				schema: createEvent_Body
			}
		],
		response: Event,
		errors: [
			{
				status: 400,
				description: `Invalid body`,
				schema: DefaultError
			},
			{
				status: 403,
				description: `Permission Denied`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/events/:eventId',
		alias: 'getEvent',
		description: `取得團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: Event,
		errors: [
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'patch',
		path: '/events/:eventId',
		alias: 'updateEvent',
		description: `更新團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				description: `更新團購`,
				type: 'Body',
				schema: updateEvent_Body
			},
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: Event,
		errors: [
			{
				status: 400,
				description: `Invalid body`,
				schema: DefaultError
			},
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'delete',
		path: '/events/:eventId',
		alias: 'deleteEvent',
		description: `刪除團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: DefaultMsg,
		errors: [
			{
				status: 403,
				description: `Permission Denied`,
				schema: DefaultError
			},
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'put',
		path: '/events/:eventId/join',
		alias: 'joinEvent',
		description: `加入團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				description: `加入團購`,
				type: 'Body',
				schema: z.object({ amount: z.number().gte(1) })
			},
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: DefaultMsg,
		errors: [
			{
				status: 400,
				description: `Owning event or Has joined`,
				schema: DefaultError
			},
			{
				status: 403,
				description: `Permission Denied`,
				schema: DefaultError
			},
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'post',
		path: '/events/:eventId/leave',
		alias: 'leaveEvent',
		description: `離開團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: DefaultMsg,
		errors: [
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/events/:eventId/msgs',
		alias: 'getEventMsgs',
		description: `取得團購的公告`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: z.array(EventMsg),
		errors: [
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'post',
		path: '/events/:eventId/msgs',
		alias: 'createEventMsg',
		description: `新增團購的公告`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				description: `新增團購訊息`,
				type: 'Body',
				schema: z.object({ content: z.string() })
			},
			{
				name: 'eventId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: z.array(EventMsg),
		errors: [
			{
				status: 403,
				description: `Permission Denied`,
				schema: DefaultError
			},
			{
				status: 404,
				description: `Event not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'post',
		path: '/login',
		alias: 'Login',
		description: `導向至 https://accounts.google.com/o/oauth2/v2/auth 取得同意授權後，取得ID、姓名`,
		requestFormat: 'json',
		response: z.void(),
		errors: [
			{
				status: 303,
				description: `redirect to homepage`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: DefaultError
			},
			{
				status: 409,
				description: `Conflict`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'post',
		path: '/logout',
		alias: 'Logout',
		description: `登出`,
		requestFormat: 'json',
		response: DefaultMsg,
		errors: [
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/users/:userId',
		alias: 'getUserInfo',
		description: `取得使用者的基本資料`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'userId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: User,
		errors: [
			{
				status: 403,
				description: `Permission Denied`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'patch',
		path: '/users/:userId',
		alias: 'updateUserInfo',
		description: `更新基本資料`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				description: `user info to be updated`,
				type: 'Body',
				schema: updateUserInfo_Body
			},
			{
				name: 'userId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: User,
		errors: [
			{
				status: 403,
				description: `Permission Denied`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/users/:userId/events',
		alias: 'getUserEvents',
		description: `取得使用者的團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'userId',
				type: 'Path',
				schema: z.string()
			}
		],
		response: z.array(Event),
		errors: [
			{
				status: 404,
				description: `User not found`,
				schema: DefaultError
			},
			{
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	}
]);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}

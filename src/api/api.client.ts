import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const Event = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.number(),
	end_time: z.number(),
	min_amount: z.number().gte(2),
	max_amount: z.number().gte(2),
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
	name: z.string().min(1),
	description: z.string(),
	category: z.string(),
	start_time: z.number(),
	end_time: z.number(),
	min_amount: z.number().gte(2),
	max_amount: z.number().gte(2),
	invited: z.array(z.string())
});
const updateEvent_Body = z.object({
	name: z.string(),
	description: z.string(),
	category: z.string(),
	start_time: z.number(),
	end_time: z.number(),
	min_people: z.number().gte(2),
	max_people: z.number().gte(2)
});
const DefaultMsg = z.object({ message: z.string(), message_code: z.string().optional() });
const EventMsg = z.object({
	id: z.string(),
	content: z.string(),
	user: z.object({ name: z.string(), avatar: z.string() }).optional(),
	created_at: z.number()
});
const Category = z.string();
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

export const schemas = {
	Event,
	DefaultError,
	createEvent_Body,
	updateEvent_Body,
	DefaultMsg,
	EventMsg,
	Category,
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
		response: z.array(Category),
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
				status: 500,
				description: `Internal Server Error`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/events/:event_id',
		alias: 'getEvent',
		description: `取得團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'event_id',
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
		path: '/events/:event_id',
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
				name: 'event_id',
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
		path: '/events/:event_id',
		alias: 'deleteEvent',
		description: `刪除團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'event_id',
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
		method: 'put',
		path: '/events/:event_id/join',
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
				name: 'event_id',
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
		method: 'post',
		path: '/events/:event_id/leave',
		alias: 'leaveEvent',
		description: `離開團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'event_id',
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
		path: '/events/:event_id/msgs',
		alias: 'getEventMsgs',
		description: `取得團購的公告`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'event_id',
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
		path: '/events/:event_id/msgs',
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
				name: 'event_id',
				type: 'Path',
				schema: z.string()
			}
		],
		response: EventMsg,
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
		method: 'post',
		path: '/login',
		alias: 'Login',
		description: `導向至 https://accounts.google.com/o/oauth2/v2/auth 取得同意授權後，取得ID、姓名`,
		requestFormat: 'json',
		response: z.void(),
		errors: [
			{
				status: 500,
				description: `Internal Server Error`,
				schema: z.void()
			}
		]
	},
	{
		method: 'post',
		path: '/logout',
		alias: 'Logout',
		description: `登出`,
		requestFormat: 'json',
		response: z.void(),
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
		path: '/users/:user_id',
		alias: 'getUserInfo',
		description: `取得使用者的基本資料`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'user_id',
				type: 'Path',
				schema: z.string()
			}
		],
		response: User,
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
	},
	{
		method: 'patch',
		path: '/users/:user_id',
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
				name: 'user_id',
				type: 'Path',
				schema: z.string()
			}
		],
		response: User,
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
				status: 404,
				description: `User not found`,
				schema: DefaultError
			}
		]
	},
	{
		method: 'get',
		path: '/users/:user_id/events',
		alias: 'getUserEvents',
		description: `取得使用者的團購`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'user_id',
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

export type types = {
	[Key in keyof typeof schemas]: z.infer<(typeof schemas)[Key]>;
};

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}
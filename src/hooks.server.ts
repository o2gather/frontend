import { server } from './mocks/server.js';
import type { HandleServerError } from '@sveltejs/kit';
import * as Sentry from '@sentry/node';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { ZodiosError } from '@zodios/core';

if (process.env.NODE_ENV === 'development') {
	server.listen();
}

export const handleError = (({ error, event }) => {
	Sentry.captureException(error, { extra: { event } });

	if (error instanceof AxiosError) {
		return {
			code: error.response?.status || 500,
			message: error.response?.data.message || error.message
		};
	} else if (error instanceof ZodError) {
		return {
			code: 400,
			message: error.issues
		};
	} else if (error instanceof ZodiosError) {
		return {
			code: 400,
			message: error.message
		};
	} else if (error instanceof Error) {
		return {
			code: 500,
			message: error.message
		};
	} else {
		return {
			code: 500,
			message: error
		};
	}
}) satisfies HandleServerError;

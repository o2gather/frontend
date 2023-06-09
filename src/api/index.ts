import { createApiClient } from './api.client';
import { loading } from '../stores/loading';
import type { ZodiosPlugin } from '@zodios/core';

const plugin: ZodiosPlugin = {
	request(api, config) {
		loading.set(true);
		return Promise.resolve(config);
	},

	response(api, config, response) {
		loading.set(false);
		return Promise.resolve(response);
	},

	error(api, config, error) {
		loading.set(false);
		return Promise.reject(error);
	}
};

const loadingApi = createApiClient(import.meta.env.VITE_API_PREFIX);
loadingApi.use(plugin);

export const api = {
	...createApiClient(import.meta.env.VITE_API_PREFIX),
	loading: loadingApi
};

import { api } from '../api';
import { error } from '@sveltejs/kit';

export const load = async () => {
	return api
		.getAllEvents()
		.then((events) => ({ events }))
		.catch((err) => {
			throw error(err.response.status, err.response.data);
		});
};

import { api } from '../api';

export const load = async () => {
	return {
		events: await api.getAllEvents(),
		categories: await api.getCategories()
	};
};

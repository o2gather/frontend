import { api } from '../api';

export const load = async () => {
	const events = await api.getAllEvents();
	return {
		events
	};
};

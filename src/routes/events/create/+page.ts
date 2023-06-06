import { superValidate } from 'sveltekit-superforms/server';
import { api } from '../../../api';
import { CreateEventBody } from '../../../api/validation/event';

export const load = async () => {
	return {
		form: await superValidate(CreateEventBody),
		categories: await api.getCategories({ withCredentials: true })
	};
};

import { superValidate } from 'sveltekit-superforms/server';
import { schemas } from '../../../api/api.client';
import { api } from '../../../api';

export const load = async () => {
	return {
		form: await superValidate(schemas.createEvent_Body),
		categories: await api.getCategories()
	};
};

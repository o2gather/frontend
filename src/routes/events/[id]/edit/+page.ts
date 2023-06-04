import { superValidate } from 'sveltekit-superforms/server';
import { schemas } from '../../../../api/api.client';
import { api } from '../../../../api';

export const ssr = false;
export const csr = true;
export const prerender = false;

export const load = async ({ params }) => {
	const { id } = params;

	return {
		event: await api.getEvent({
			params: {
				eventId: id
			},
			withCredentials: true
		}),
		form: await superValidate(schemas.updateEvent_Body),
		categories: await api.getCategories({ withCredentials: true })
	};
};

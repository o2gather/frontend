import { superValidate } from 'sveltekit-superforms/server';
import { schemas } from '../../../../api/api.client';
import { api } from '../../../../api';

export const load = async ({ params }) => {
	const { id } = params;

	return {
		event: await api.getEvent({
			params: {
				eventId: id
			}
		}),
		form: await superValidate(schemas.updateEvent_Body),
		categories: await api.getCategories()
	};
};

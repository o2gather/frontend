import { superValidate } from 'sveltekit-superforms/server';
import { api } from '../../../../api';
import { UpdateEventBody } from '../../../../api/validation/event';

export const load = async ({ params }) => {
	const { id } = params;

	return {
		event: await api.getEvent({
			params: {
				eventId: id
			},
			withCredentials: true
		}),
		form: await superValidate(UpdateEventBody),
		categories: await api.getCategories({ withCredentials: true })
	};
};

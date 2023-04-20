import { error } from '@sveltejs/kit';
import { api } from '../../../api';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;

	return api
		.getEvent({ params: { event_id: id } })
		.then((event) => ({ event }))
		.catch((err) => {
			throw error(err.response.status, err.response.data);
		});
}) satisfies PageLoad;

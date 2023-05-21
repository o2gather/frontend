import { api } from '../../../api';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;

	return {
		event: await api.getEvent({ params: { event_id: id } }),
		messages: await api.getEventMsgs({ params: { event_id: id } })
	};
}) satisfies PageLoad;

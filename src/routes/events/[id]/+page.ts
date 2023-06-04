import { api } from '../../../api';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;

	return {
		event: await api.getEvent({ params: { eventId: id }, withCredentials: true }),
		messages: await api.getEventMsgs({ params: { eventId: id }, withCredentials: true })
	};
}) satisfies PageLoad;

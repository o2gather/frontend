import { api } from '../../../api';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;

	return {
		event: await api.getEvent({ params: { eventId: id } }),
		messages: await api.getEventMsgs({ params: { eventId: id } })
	};
}) satisfies PageLoad;

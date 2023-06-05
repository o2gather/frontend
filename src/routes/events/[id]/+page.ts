import { api } from '../../../api';
import { auth } from '../../../stores/auth';
import type { PageLoad } from './$types';

export const ssr = false;
export const csr = true;

export const load = (async ({ params }) => {
	const { id } = params;

	const userId = await auth.getUserId();

	return {
		event: await api.getEvent({ params: { eventId: id }, withCredentials: true }),
		messages: await api.getEventMsgs({
			params: { eventId: id },
			withCredentials: true
		}),
		userEvents: userId
			? await api.getUserEvents({
					params: {
						userId
					},
					withCredentials: true
			  })
			: []
	};
}) satisfies PageLoad;

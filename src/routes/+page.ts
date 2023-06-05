import { browser } from '$app/environment';
import { api } from '../api';
import { auth } from '../stores/auth';

export const load = async ({ url }) => {
	if (browser) {
		const url = new URL(location.href);
		const userId = url.searchParams.get('user_id');
		if (userId) {
			auth.setUserId(userId);
			url.searchParams.delete('user_id');
			location.href = url.toString();
		}
	}

	let events = [];
	const userId = await auth.getUserId();
	const filterValue = url.searchParams.get('filter');
	if (userId && filterValue) {
		events = (
			await api.getUserEvents({
				params: {
					userId
				},
				withCredentials: true
			})
		).filter((event) => {
			if (filterValue === 'organized') {
				return event.owner?.id === userId;
			} else if (filterValue === 'joined') {
				return event.owner?.id !== userId;
			}
		});
	} else {
		events = await api.getAllEvents({ withCredentials: true });
	}

	return {
		events,
		categories: await api.getCategories({ withCredentials: true })
	};
};

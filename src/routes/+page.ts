import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { api } from '../api';
import { auth } from '../stores/auth';

export const load = async () => {
	if (browser) {
		const url = new URL(location.href);
		const userId = url.searchParams.get('user_id');
		if (userId) {
			auth.setUserId(userId);
			url.searchParams.delete('user_id');
			throw redirect(302, url.toString());
		}
	}

	return {
		events: await api.getAllEvents({ withCredentials: true }),
		categories: await api.getCategories({ withCredentials: true })
	};
};

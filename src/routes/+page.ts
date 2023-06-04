import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { api } from '../api';
import { auth } from '../stores/auth';

export const load = async () => {
	if (browser) {
		const url = new URL(location.href);
		const token = url.searchParams.get('token');
		if (token) {
			auth.setToken(token);
			url.searchParams.delete('token');
			redirect(302, url.toString());
		}
	}

	return {
		events: await api.getAllEvents(),
		categories: await api.getCategories()
	};
};

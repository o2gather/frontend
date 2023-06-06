import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '../api/api.client';
import { api } from '../api';
import { goto } from '$app/navigation';

interface Auth {
	userId?: string | null;
	user?: User | null;
}

const { subscribe, set } = writable<Auth>({
	userId: null,
	user: null
});

const setUserId = (userId: string | null) => {
	if (userId) {
		if (browser) {
			localStorage.setItem('userId', userId);
		}

		set({ userId, user: null });
	} else {
		if (browser) {
			localStorage.removeItem('userId');
		}
		set({ userId: null, user: null });
	}
};

const setUser = (user: User) => {
	if (user) {
		set({ userId: user.id, user });
	} else {
		set({ userId: null, user: null });
	}
};

if (browser && localStorage.getItem('userId')) {
	setUserId(localStorage.getItem('userId'));
}

export const auth = {
	subscribe,
	setUserId,
	setUser,
	getUserId: () => {
		return new Promise<string | null | undefined>((resolve) =>
			subscribe(({ userId }) => resolve(userId))()
		);
	},
	logout: async () => {
		await api.loading.Logout(undefined, { withCredentials: true });
		setUserId(null);
		await goto('/');
	}
};

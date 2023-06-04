import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function decode(token: string) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);

		return JSON.parse(jsonPayload);
	} catch (e) {
		throw new Error('ParseError: ' + (e as Error).message);
	}
}

interface User {
	name: string;
	email: string;
	picture: string;
}

interface Auth {
	token: string | null;
	user: User | null;
}

const { subscribe, set } = writable<Auth>({
	token: null,
	user: null
});

const setToken = (token: string | null) => {
	if (token) {
		if (browser) {
			localStorage.setItem('token', token);
		}

		const { name, email, picture } = decode(token);
		set({ token, user: { name, email, picture } });
	} else {
		if (browser) {
			localStorage.removeItem('token');
		}
		set({ token: null, user: null });
	}
};

if (browser && localStorage.getItem('token')) {
	try {
		setToken(localStorage.getItem('token'));
	} catch (e) {
		setToken(null);
		console.error(e);
	}
}

export const auth = {
	subscribe,
	setToken,
	getToken: () => {
		return new Promise<string | null>((resolve) => subscribe(({ token }) => resolve(token))());
	},
	getUser: () => {
		return new Promise<User | null>((resolve) => subscribe(({ user }) => resolve(user))());
	},
	reset: () => {
		setToken(null);
	}
};

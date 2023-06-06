import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);

export const loading = {
	subscribe,
	set,
	get: () => {
		return new Promise<boolean>((resolve) => subscribe((loading) => resolve(loading))());
	}
};

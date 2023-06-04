import { derived } from 'svelte/store';
import { auth } from './auth';

export const loggedIn = derived(auth, ($auth) => !!$auth.token);

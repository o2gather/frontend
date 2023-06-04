import { derived } from 'svelte/store';
import { auth } from './auth';

export const user = derived(auth, ($auth) => $auth.user);

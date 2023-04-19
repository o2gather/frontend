import { superValidate } from 'sveltekit-superforms/server';
import { schemas } from '../../../api/api.client';

export const prerender = true;

export const load = async () => {
	const form = await superValidate(schemas.createEvent_Body);

	return {
		form
	};
};

import { tick } from 'svelte';
import { api } from '.';
import { loading } from '../stores/loading';
import { server } from '../mocks/server';

beforeAll(() => {
	server.listen();
});

afterAll(() => {
	server.close();
});

describe('test api client', () => {
	test('test loading api client', async () => {
		expect(await loading.get()).toBeFalsy();
		const res = api.loading.getAllEvents();
		await tick();
		expect(await loading.get()).toBeTruthy();
		await res;
		expect(await loading.get()).toBeFalsy();
	});

	test('test loading api client error', async () => {
		await api.loading.getAllEvents().catch((err) => {
			expect(err.response.status).toBe(500);
		});
	});
});

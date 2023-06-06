import { render } from '@testing-library/svelte';
import Page from './routes/+page.svelte';
import { generateMock } from '@anatine/zod-mock';
import { schemas } from './api/api.client';

describe('index test', () => {
	test('test correct render event cards', () => {
		const page = render(Page, {
			props: {
				data: {
					categories: [],
					events: []
				}
			}
		});

		console.log(page.container.innerHTML);
	});
});

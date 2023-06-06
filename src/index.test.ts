import { fireEvent, render } from '@testing-library/svelte';
import Page from './routes/+page.svelte';
import { generateMock } from '@anatine/zod-mock';
import { schemas } from './api/api.client';

describe('index test', () => {
	test('test correct render event cards', () => {
		const eventLength = 5;
		const page = render(Page, {
			props: {
				data: {
					categories: [],
					events: new Array(eventLength).fill(0).map(() => generateMock(schemas.Event))
				}
			}
		});

		const cards = page.getAllByTestId('card');
		expect(cards.length).toBe(eventLength);
	});

	test('test correct render category', () => {
		const maxCategoryLength = 5;
		const categories = [
			...new Set(new Array(maxCategoryLength).fill(0).map(() => generateMock(schemas.Category)))
		];
		const page = render(Page, {
			props: {
				data: {
					categories,
					events: []
				}
			}
		});

		const categoryElements = page.getAllByTestId('category');
		expect(categoryElements.length).toBe(categories.length);
	});

	test('test correct render filtered event cards by category', async () => {
		const eventLength = 5;
		const categoryLength = 5;
		const categories = new Array(categoryLength).fill(0).map(() => generateMock(schemas.Category));
		const events = new Array(eventLength).fill(0).map(() => generateMock(schemas.Event));

		events.forEach((event) => {
			event.category = categories[Math.floor(Math.random() * categoryLength)];
		});

		const page = render(Page, {
			props: {
				data: {
					categories,
					events
				}
			}
		});

		const categoriesElement = page.getAllByTestId('category');
		for (let i = 0; i < categoryLength; i++) {
			await fireEvent.click(categoriesElement[i]);
			const cards = page.queryAllByTestId('card');
			expect(cards.length).toBe(events.filter((event) => event.category === categories[i]).length);
		}
	});

	test('test correct render filtered event cards by status', async () => {
		const eventLength = 5;
		const events = new Array(eventLength).fill(0).map(() => generateMock(schemas.Event));

		events.forEach((event) => {
			event.established = Math.random() > 0.5;
		});

		const page = render(Page, {
			props: {
				data: {
					categories: [],
					events
				}
			}
		});

		const filterButton = page.getByTestId('filter-button');
		const showStatuses = ['All', 'Established', 'Preparing'];
		type ShowStatus = (typeof showStatuses)[number];
		for (let i = 0; i < showStatuses.length; i++) {
			const showStatus: ShowStatus = filterButton.textContent?.trim() as ShowStatus;
			const cards = page.queryAllByTestId('card');
			if (showStatus === 'All') {
				expect(cards.length).toBe(events.length);
			} else if (showStatus === 'Established') {
				expect(cards.length).toBe(events.filter((event) => event.established).length);
			} else if (showStatus === 'Preparing') {
				expect(cards.length).toBe(events.filter((event) => !event.established).length);
			}
			await fireEvent.click(filterButton);
		}
	});
});

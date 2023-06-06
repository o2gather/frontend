import { generateMock } from '@anatine/zod-mock';
import { schemas } from '../../api/api.client';
import { fireEvent, render } from '@testing-library/svelte';
import Card from '../Card.svelte';
import * as navigation from '$app/navigation';

describe('test Card', () => {
	test('test correct render', async () => {
		const event = generateMock(schemas.Event);
		const card = render(Card, {
			props: {
				event
			}
		});

		expect(card.getByText(event.name));
		expect(card.getByText(event.description));
	});

	test('test correct render with established', async () => {
		const event = generateMock(schemas.Event);
		event.established = true;
		const card = render(Card, {
			props: {
				event
			}
		});

		expect(card.getByText('Established'));
	});

	test('test correct render with preparing', async () => {
		const event = generateMock(schemas.Event);
		event.established = false;
		const card = render(Card, {
			props: {
				event
			}
		});

		expect(card.getByText('Preparing'));
	});

	test('test correct render with preparing and member count is full', async () => {
		const event = generateMock(schemas.Event);
		event.established = false;
		event.members_count = event.max_amount;
		const card = render(Card, {
			props: {
				event
			}
		});

		expect(card.getByText('Full'));
	});

	test('test correct render with established and member count is full', async () => {
		const event = generateMock(schemas.Event);
		event.established = true;
		event.members_count = event.max_amount;
		const card = render(Card, {
			props: {
				event
			}
		});

		expect(card.getByText('Established'));
	});

	test('test click card', async () => {
		const mock = vi.spyOn(navigation, 'goto');
		vi.mock('$app/navigation', () => {
			return {
				goto: () => Promise.resolve()
			};
		});
		const event = generateMock(schemas.Event);
		const card = render(Card, {
			props: {
				event
			}
		});

		await fireEvent.click(card.getByTestId('card'));
		expect(mock).toBeCalledWith(`/events/${event.id}`);
	});
});

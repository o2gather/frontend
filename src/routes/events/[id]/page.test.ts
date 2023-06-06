import { render } from '@testing-library/svelte';
import Page from './+page.svelte';
import { generateMock } from '@anatine/zod-mock';
import { schemas } from '../../../api/api.client';
import { auth } from '../../../stores/auth';

describe('test events/[id]/+page', () => {
	test('test correct render for preparing event', async () => {
		const messageLength = 5;

		const event = generateMock(schemas.Event);
		const messages = new Array(messageLength).fill(0).map(() => generateMock(schemas.EventMsg));
		event.established = false;
		event.members_count = 0;

		const page = render(Page, {
			props: {
				data: {
					event,
					messages,
					userEvents: []
				}
			}
		});

		expect(page.getByText(event.name));
		expect(page.getByText(event.description));

		const messageElements = page.getAllByTestId('message');
		expect(messageElements.length).toBe(messageLength);

		messageElements.forEach((messageElement, index) => {
			expect(messageElement.textContent).toContain(messages[index].content);
		});

		expect(page.getByTestId('join-button'));
		expect(page.queryByTestId('leave-button')).toBeNull();
		expect(page.getByTestId('status').textContent).toBe('Preparing');
		expect(page.queryByTestId('member')).toBeNull();
	});
	test('test correct render for established event', async () => {
		const messageLength = 5;

		const event = generateMock(schemas.Event);
		const messages = new Array(messageLength).fill(0).map(() => generateMock(schemas.EventMsg));
		event.established = true;

		const page = render(Page, {
			props: {
				data: {
					event,
					messages,
					userEvents: []
				}
			}
		});

		expect(page.getByText(event.name));
		expect(page.getByText(event.description));

		const messageElements = page.getAllByTestId('message');
		expect(messageElements.length).toBe(messageLength);

		messageElements.forEach((messageElement, index) => {
			expect(messageElement.textContent).toContain(messages[index].content);
		});

		expect(page.queryByTestId('join-button')).toBeNull();
		expect(page.queryByTestId('leave-button')).toBeNull();
		expect(page.getByTestId('status').textContent).toBe('Established');
		expect(page.queryByTestId('member')).toBeNull();
	});

	describe('test logged-in scenario', () => {
		test('test correct render user participated event', async () => {
			const messageLength = 5;

			const event = generateMock(schemas.Event);
			const messages = new Array(messageLength).fill(0).map(() => generateMock(schemas.EventMsg));
			event.established = false;

			const page = render(Page, {
				props: {
					data: {
						event,
						messages,
						userEvents: [event]
					}
				}
			});

			expect(page.getByText(event.name));

			expect(page.getByTestId('description').textContent).toBe(event.description);

			const messageElements = page.getAllByTestId('message');
			expect(messageElements.length).toBe(messageLength);

			messageElements.forEach((messageElement, index) => {
				expect(messageElement.textContent).toContain(messages[index].content);
			});

			expect(page.queryByTestId('join-button')).toBeNull();
			expect(page.getByTestId('leave-button'));
			expect(page.getByTestId('status').textContent).toBe('Preparing');
			expect(page.queryByTestId('member')).toBeNull();
		});

		test('test correct render owner event', async () => {
			const messageLength = 5;

			const user = generateMock(schemas.User);
			const event = generateMock(schemas.Event);
			const messages = new Array(messageLength).fill(0).map(() => generateMock(schemas.EventMsg));
			event.established = true;

			auth.setUserId(user.id as string);

			event.owner = {
				id: user.id,
				email: user.email,
				name: user.name as string,
				avatar: user.avatar as string
			};

			const page = render(Page, {
				props: {
					data: {
						event,
						messages,
						userEvents: [event]
					}
				}
			});

			expect(page.getByText(event.name));
			expect(page.getByText(event.description));

			const messageElements = page.getAllByTestId('message');
			expect(messageElements.length).toBe(messageLength);

			messageElements.forEach((messageElement, index) => {
				expect(messageElement.textContent).toContain(messages[index].content);
			});

			expect(page.queryByTestId('join-button')).toBeNull();
			expect(page.queryByTestId('leave-button')).toBeNull();
			expect(page.getByTestId('status').textContent).toBe('Established');

			const memberElements = page.getAllByTestId('member');
			expect(memberElements.length).toBe((event.members?.length as number) + 1);
			memberElements.forEach((memberElement, index) => {
				if (index === 0) {
					expect(memberElement.textContent).toContain(user.name);
				} else {
					expect(memberElement.textContent).toContain(event.members?.[index - 1].name);
				}
			});
		});
	});
});

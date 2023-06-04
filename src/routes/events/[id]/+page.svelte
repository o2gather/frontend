<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '../../../api';
	import { auth } from '../../../stores/auth';
	import { isoToDateTimeString } from './../../../utils';
	import { onMount, tick } from 'svelte';
	import Swal from 'sweetalert2';

	let messageDiv: HTMLDivElement;
	let comment: string;

	onMount(() => {
		messageDiv.scrollTop = messageDiv.scrollHeight;
	});

	export let data;
	let { event, messages } = data;

	$: startDate = isoToDateTimeString(event.start_time);
	$: endDate = isoToDateTimeString(event.end_time);

	$: isOwner = event.user_id === $auth.userId;
	$: isMember = event.members?.some((member) => member.email === $auth.user?.email) ?? false;
</script>

<div class="mx-12 mb-12 mt-8 flex flex-col gap-6 md:mx-36">
	<div class="flex items-center justify-between text-4xl font-bold">
		<div class="flex items-center">
			{event.name}
			{#if !(isMember || isOwner)}
				<button
					class="ml-4 inline-flex cursor-pointer items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					on:click={() => {
						api
							.joinEvent(
								{
									amount: 1
								},
								{
									params: {
										eventId: event.id
									},
									withCredentials: true
								}
							)
							.then((res) => {
								console.log(res);
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					Join

					<img src="/plus.svg" class="-mr-1 ml-2 h-4 w-4" alt="plus" />
				</button>
			{/if}
		</div>
		{#if isOwner}
			<div>
				<a
					class="ml-4 inline-flex cursor-pointer items-center rounded-lg bg-yellow-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
					href={`/events/${event.id}/edit`}
				>
					Edit
				</a>
				<button
					type="button"
					class="mb-2 mr-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
					on:click={() => {
						Swal.fire({
							title: 'Delete Event',
							text: 'Are you sure you want to delete this event?',
							icon: 'question',
							confirmButtonText: 'Yes',
							confirmButtonColor: 'rgb(185 28 28)',
							cancelButtonText: 'No',
							showCancelButton: true
						}).then((result) => {
							if (result.isConfirmed) {
								api
									.deleteEvent(undefined, {
										params: {
											eventId: event.id
										},
										withCredentials: true
									})
									.then(async () => {
										await tick();
										Swal.fire({
											title: 'Deleted!',
											text: 'Your event has been deleted.',
											icon: 'success',
											confirmButtonText: 'OK'
										});
										goto('/');
									})
									.catch((err) => {
										console.log(err);
									});
							}
						});
					}}
				>
					Delete
				</button>
			</div>
		{/if}
	</div>

	<div class="text-gray-400">
		{new Date(startDate).toLocaleString()}
		{#if event.end_time}
			- {new Date(endDate).toLocaleString()}
		{/if}
	</div>

	<div class="border-b border-gray-200 dark:border-gray-700" />
</div>

<div class="m-8 grid-cols-[3fr_2fr] gap-16 md:mx-36 xl:grid">
	<div class="mb-12 flex flex-col gap-6">
		<div class="mt-4 leading-8">
			{event.description}
		</div>
	</div>
	<div>
		<div
			class="flex h-[calc(100vh-500px)] flex-col items-center overflow-y-scroll"
			bind:this={messageDiv}
		>
			{#each messages as message}
				<div
					class="my-2 flex w-full items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-3xl md:flex-row"
				>
					<div class="flex flex-col items-center justify-center p-2">
						<figure>
							<img
								class="m-2 aspect-square h-20 w-20 rounded-full bg-gray-200 object-cover object-center"
								src={message.user?.avatar}
								alt=""
							/>
							<figcaption class="text-center text-xs text-gray-500 dark:text-gray-400">
								{message.user?.name}
							</figcaption>
						</figure>
					</div>
					<div class="m-4">
						{message.content}
					</div>
				</div>
			{/each}
		</div>

		{#if isMember || isOwner}
			<div class="mx-auto mb-4 mt-2 flex max-w-3xl flex-col items-center rounded-lg shadow">
				<form
					class="w-full"
					on:submit|preventDefault={() => {
						api
							.createEventMsg(
								{
									content: comment
								},
								{
									params: {
										eventId: event.id
									},
									withCredentials: true
								}
							)
							.then(async (result) => {
								messages = [...messages, ...result];
								await tick();
								messageDiv.scrollTop = messageDiv.scrollHeight;
							})
							.catch((error) => {
								console.log(error);
							})
							.finally(() => {
								comment = '';
							});
					}}
				>
					<textarea
						rows="4"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Write your thoughts here..."
						bind:value={comment}
					/>
					<button
						class="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						type="submit">Comment</button
					>
				</form>
			</div>
		{/if}
	</div>
</div>

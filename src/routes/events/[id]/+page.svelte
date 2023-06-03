<script lang="ts">
	import { api } from '../../../api';
	import { isoToDateTimeString } from './../../../utils';
	import { onMount, tick } from 'svelte';

	let messageDiv: HTMLDivElement;
	let comment: string;

	onMount(() => {
		messageDiv.scrollTop = messageDiv.scrollHeight;
	});

	export let data;
	let { event, messages } = data;

	$: startDate = isoToDateTimeString(event.start_time);
	$: endDate = isoToDateTimeString(event.end_time);
</script>

<div class="mx-12 md:mx-36 mt-8 mb-12 flex flex-col gap-6">
	<div class="font-bold text-4xl flex items-center">
		{event.name}
		<div
			class="inline-flex items-center px-3 py-2 text-sm font-medium text-center ml-4 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
		>
			Join

			<img src="/plus.svg" class="w-4 h-4 ml-2 -mr-1" alt="plus" />
		</div>
	</div>

	<div class="text-gray-400">
		{startDate}
		{#if event.end_time}
			- {endDate}
		{/if}
	</div>

	<div class="border-b border-gray-200 dark:border-gray-700" />
</div>

<div class="gap-16 m-8 md:mx-36 grid-cols-[3fr_2fr] xl:grid">
	<div class="mb-12 flex flex-col gap-6">
		<div class="leading-8 mt-4">
			{event.description}
		</div>
	</div>
	<div>
		<div
			class="flex flex-col items-center h-[calc(100vh-500px)] overflow-y-scroll"
			bind:this={messageDiv}
		>
			{#each messages as message}
				<div
					class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow w-full md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
				>
					<div class="flex flex-col items-center justify-center p-2">
						<figure>
							<img
								class="object-cover object-center w-20 h-20 m-2 rounded-full aspect-square bg-gray-200"
								src={message.user?.avatar}
								alt=""
							/>
							<figcaption class="text-xs text-gray-500 dark:text-gray-400 text-center">
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

		<div class="flex flex-col items-center mx-auto mt-2 mb-4 rounded-lg shadow max-w-3xl">
			<form
				class="w-full"
				on:submit|preventDefault={() => {
					comment = '';
					api
						.createEventMsg(
							{
								content: comment
							},
							{
								params: {
									eventId: event.id
								}
							}
						)
						.then(async (result) => {
							messages = [...messages, ...result];
							await tick();
							messageDiv.scrollTop = messageDiv.scrollHeight;
						})
						.catch((error) => {
							console.log(error);
						});
				}}
			>
				<textarea
					rows="4"
					class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Write your thoughts here..."
					bind:value={comment}
				/>
				<button
					class="inline-flex items-center justify-center w-full px-3 cursor-pointer py-2 mt-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					type="submit">Comment</button
				>
			</form>
		</div>
	</div>
</div>

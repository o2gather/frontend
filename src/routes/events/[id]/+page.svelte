<script lang="ts">
	import { isoToDateTimeString } from './../../../utils';
	import { onMount } from 'svelte';

	let messageDiv: HTMLDivElement;

	onMount(() => {
		messageDiv.scrollTop = messageDiv.scrollHeight;
	});

	export let data;
	const { event } = data;

	$: startDate = isoToDateTimeString(event.start_time);
	$: endDate = isoToDateTimeString(event.end_time);
</script>

<div class="mx-12 md:mx-36 mt-8 mb-12 flex flex-col gap-6">
	<div class="font-bold text-4xl">{event.name}</div>

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
			<div
				class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<img
					class="object-cover object-center w-20 h-20 m-4 rounded-full aspect-square bg-gray-200"
					src="https://source.unsplash.com/featured/200x200"
					alt=""
				/>
				<div class="m-4">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</div>
			</div>

			<div
				class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<div class="m-4">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</div>

				<img
					class="object-cover object-center w-20 h-20 m-4 rounded-full aspect-square bg-gray-200"
					src="https://source.unsplash.com/featured/200x200"
					alt=""
				/>
			</div>

			<div
				class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<img
					class="object-cover object-center w-20 h-20 m-4 rounded-full aspect-square bg-gray-200"
					src="https://source.unsplash.com/featured/200x200"
					alt=""
				/>
				<div class="m-4">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</div>
			</div>

			<div
				class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<div class="m-4">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</div>

				<img
					class="object-cover object-center w-20 h-20 m-4 rounded-full aspect-square bg-gray-200"
					src="https://source.unsplash.com/featured/200x200"
					alt=""
				/>
			</div>

			<div
				class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<img
					class="object-cover object-center w-20 h-20 m-4 rounded-full aspect-square bg-gray-200"
					src="https://source.unsplash.com/featured/200x200"
					alt=""
				/>
				<div class="m-4">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</div>
			</div>

			<div
				class="flex items-center bg-white border border-gray-200 my-2 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<div class="m-4">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</div>

				<img
					class="object-cover object-center w-20 h-20 m-4 rounded-full aspect-square bg-gray-200"
					src="https://source.unsplash.com/featured/200x200"
					alt=""
				/>
			</div>
		</div>

		<div class="flex flex-col items-center mx-auto mt-2 mb-4 rounded-lg shadow max-w-3xl">
			<textarea
				rows="4"
				class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Write your thoughts here..."
			/>
			<button
				class="inline-flex items-center justify-center w-full px-3 cursor-pointer py-2 mt-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>Comment</button
			>
		</div>
	</div>
</div>

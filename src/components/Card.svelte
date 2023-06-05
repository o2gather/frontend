<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Event } from '../api/api.client';

	export let event: Event;
	$: link = `/events/${event.id}`;
</script>

<div
	on:click={() => goto(link)}
	on:keypress={() => goto(link)}
	class="h-full cursor-pointer rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
>
	<div class="flex h-full flex-col p-8">
		<div class="flex flex-wrap justify-between gap-y-2">
			<h5 class="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{event.name}
			</h5>
			<span class="mt-1 text-sm text-gray-400">
				{(event.members_count ?? 0) + 1} / {event.max_amount} Person
			</span>
		</div>
		<p
			class="mb-10 line-clamp-2 grow whitespace-pre-wrap font-normal text-gray-600 dark:text-gray-400"
		>
			{event.description}
		</p>
		<div class="flex flex-wrap items-center justify-between gap-y-2">
			<span class="text-sm font-bold uppercase">
				{#if event.established}
					<div class="text-green-600">Established</div>
				{:else if event.members_count === event.max_amount}
					<div class="text-red-600">Full</div>
				{:else}
					<div class="text-yellow-600">Preparing</div>
				{/if}
			</span>
			<div
				class="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Read more

				<img src="/arrow.svg" class="-mr-1 ml-2 h-4 w-4" alt="arrow" />
			</div>
		</div>
	</div>
</div>

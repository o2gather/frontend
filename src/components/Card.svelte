<script lang="ts">
	import { goto } from '$app/navigation';
	import { testid } from '../actions/testid';
	import type { Event } from '../api/api.client';

	export let event: Event;
	$: link = `/events/${event.id}`;
</script>

<div
	on:click={() => goto(link)}
	on:keypress={() => goto(link)}
	class="h-full cursor-pointer rounded-lg border border-gray-200 bg-white shadow"
	use:testid={'card'}
>
	<div class="flex h-full flex-col p-8">
		<div class="flex justify-between gap-y-2">
			<h5 class="mb-8 w-2/3 break-words text-2xl font-bold tracking-tight text-gray-900">
				{event.name}
			</h5>
			<span class="ml-2 mt-1 w-1/3 whitespace-nowrap text-right text-sm text-gray-400">
				{(event.members_count ?? 0) + 1} / {event.max_amount} Person
			</span>
		</div>
		<p class="mb-10 line-clamp-2 grow whitespace-pre-wrap font-normal text-gray-600">
			{event.description}
		</p>
		<div class="flex flex-wrap items-center justify-between gap-y-2">
			<span class="text-sm font-bold uppercase">
				{#if event.established}
					<div class="text-green-600">Established</div>
				{:else if new Date().getTime() > event.end_time}
					{#if (event.members_count ?? 0) + 1 < event.min_amount}
						<div class="text-red-600">Expired</div>
					{:else}
						<div class="text-gray-600">Pending</div>
					{/if}
				{:else if (event.members_count ?? 0) + 1 === event.max_amount}
					<div class="text-red-600">Full</div>
				{:else}
					<div class="text-yellow-600">Preparing</div>
				{/if}
			</span>
			<div
				class="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
			>
				Read more

				<img src="/arrow.svg" class="-mr-1 ml-2 h-4 w-4" alt="arrow" />
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import Card from '../components/Card.svelte';

	export let data;

	const { events, categories } = data;

	let selectedCategory: string | null = null;
	$: filteredEvents = events.filter(
		(event) => selectedCategory === null || event.category === selectedCategory
	);
</script>

<div class="mx-2 flex flex-wrap items-center justify-center py-4 md:py-8">
	<button
		type="button"
		class="{selectedCategory === null
			? 'border-blue-600 text-blue-700'
			: 'border-white text-gray-900'} mb-3 mr-3 rounded-full border bg-white px-5 py-2.5 text-center text-base font-medium hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
		on:click={() => (selectedCategory = null)}>All categories</button
	>
	{#each categories as category}
		<button
			type="button"
			class="{selectedCategory === category
				? 'border-blue-600 text-blue-700'
				: 'border-white text-gray-900'} mb-3 mr-3 rounded-full border bg-white px-5 py-2.5 text-center text-base font-medium hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
			on:click={() => (selectedCategory = category)}
		>
			{category}
		</button>
	{/each}
</div>
<div class="mx-6 mb-12 grid grid-cols-1 gap-6 md:mx-12 md:grid-cols-3">
	{#each filteredEvents as event (event.id)}
		<Card title={event.name} description={event.description} link={`/events/${event.id}`} />
	{/each}
</div>

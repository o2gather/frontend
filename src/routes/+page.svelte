<script lang="ts">
	import { testid } from '../actions/testid';
	import Card from '../components/Card.svelte';
	import ChangeIcon from '../components/ChangeIcon.svelte';

	export let data;

	function capitalizeFirstLetter(str: string) {
		return str
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	let { categories } = data;
	categories = [...new Set(categories.map((category) => category.trim().toLowerCase()))].map(
		(category) => capitalizeFirstLetter(category)
	);

	let showStatus: 'All' | 'Established' | 'Preparing' = 'All';
	let showStatusButtonHovered = false;

	let searchText = '';

	let selectedCategory: string | null = null;
	$: filteredEvents = data.events
		.filter((event) => {
			const isSelectedCategory =
				selectedCategory === null ||
				event.category.trim().toUpperCase() === selectedCategory.trim().toUpperCase();
			const isSelectedStatus =
				showStatus === 'All' ||
				(showStatus === 'Established' && event.established) ||
				(showStatus === 'Preparing' && !event.established);

			return isSelectedCategory && isSelectedStatus;
		})
		.filter((event) => event.name.includes(searchText));
</script>

<div class="mx-2 flex flex-wrap items-center justify-center py-4">
	<button
		type="button"
		use:testid={'filter-button'}
		class="{showStatus === 'All'
			? 'border-gray-600  hover:bg-black  focus:ring-gray-300'
			: showStatus === 'Established'
			? ' border-green-600   text-green-700 hover:bg-green-700  focus:ring-green-300'
			: 'border-orange-600   text-orange-700 hover:bg-orange-700  focus:ring-orange-300'} mb-3 mr-3 flex flex-nowrap items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-center text-base font-medium transition-all duration-500 hover:text-white focus:outline-none focus:ring-4"
		on:click={() => {
			if (showStatus === 'All') {
				showStatus = 'Established';
			} else if (showStatus === 'Established') {
				showStatus = 'Preparing';
			} else {
				showStatus = 'All';
			}
		}}
		on:mouseenter={() => (showStatusButtonHovered = true)}
		on:mouseleave={() => (showStatusButtonHovered = false)}
	>
		{#if showStatus === 'All'}
			<ChangeIcon
				class="h-5 w-5 {showStatusButtonHovered
					? 'rotate-180 fill-white'
					: 'fill-black'} transition-all duration-500"
			/>
			All
		{:else if showStatus === 'Established'}
			<ChangeIcon
				class="h-5 w-5 {showStatusButtonHovered
					? 'rotate-180 fill-white'
					: 'fill-green-700'} transition-all duration-500"
			/>
			Established
		{:else}
			<ChangeIcon
				class="h-5 w-5 {showStatusButtonHovered
					? 'rotate-180 fill-white'
					: 'fill-orange-700'} transition-all duration-500"
			/>
			Preparing
		{/if}
	</button>
	<button
		type="button"
		class="{selectedCategory === null
			? 'border-blue-600 text-blue-700'
			: 'border-white text-gray-900'} mb-3 mr-3 rounded-full border bg-white px-5 py-2.5 text-center text-base font-medium hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
		on:click={() => (selectedCategory = null)}>All categories</button
	>
	{#each categories as category}
		<button
			type="button"
			class="{selectedCategory?.trim().toUpperCase() === category.trim().toUpperCase()
				? 'border-blue-600 text-blue-700'
				: 'border-white text-gray-900'} mb-3 mr-3 rounded-full border bg-white px-5 py-2.5 text-center text-base font-medium hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
			on:click={() => (selectedCategory = category)}
			use:testid={'category'}
		>
			{category}
		</button>
	{/each}
</div>

<div class="relative mx-6 mb-8 md:mx-12">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<svg
			aria-hidden="true"
			class="h-5 w-5 text-gray-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/></svg
		>
	</div>
	<input
		type="search"
		id="default-search"
		class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		placeholder="Search.."
		bind:value={searchText}
	/>
</div>

<div class="mx-6 mb-12 grid grid-cols-1 gap-6 md:mx-12 md:grid-cols-3">
	{#each filteredEvents as event (event.id)}
		<Card {event} />
	{/each}
</div>

<script lang="ts">
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

	let selectedCategory: string | null = null;
	$: filteredEvents = data.events.filter((event) => {
		const isSelectedCategory =
			selectedCategory === null ||
			event.category.trim().toUpperCase() === selectedCategory.trim().toUpperCase();
		const isSelectedStatus =
			showStatus === 'All' ||
			(showStatus === 'Established' && event.established) ||
			(showStatus === 'Preparing' && !event.established);

		return isSelectedCategory && isSelectedStatus;
	});
</script>

<div class="mx-2 flex flex-wrap items-center justify-center py-4 md:py-8">
	<button
		type="button"
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
		>
			{category}
		</button>
	{/each}
</div>
<div class="mx-6 mb-12 grid grid-cols-1 gap-6 md:mx-12 md:grid-cols-3">
	{#each filteredEvents as event (event.id)}
		<Card {event} />
	{/each}
</div>

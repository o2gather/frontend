<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let description: string;
	export let link: string;
</script>

<div
	on:click={() => goto(link)}
	on:keypress={() => goto(link)}
	class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
>
	<!-- <img
		class="rounded-t-lg object-cover object-center w-full h-48 bg-gray-200"
		src="https://source.unsplash.com/featured/200x200"
		alt=""
	/> -->
	<div class="p-8">
		<h5
			class="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white cursor-auto"
			on:click|stopPropagation
			on:keypress|stopPropagation
		>
			{title}
		</h5>
		<p
			class="mb-10 font-normal text-gray-600 dark:text-gray-400 cursor-auto line-clamp-2"
			on:click|stopPropagation
			on:keypress|stopPropagation
		>
			{description}
		</p>
		<div class="flex flex-row justify-between">
			<div
				class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Read more

				<img src="arrow.svg" class="w-4 h-4 ml-2 -mr-1" alt="arrow" />
			</div>
			<div
				class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Join

				<img src="plus.svg" class="w-4 h-4 ml-2 -mr-1" alt="plus" />
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div
	on:click={() => goto('/events/1')}
	on:keypress={() => goto('/events/1')}
	class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
>
	<img
		class="rounded-t-lg object-cover object-center w-full h-48 bg-gray-200"
		src="https://source.unsplash.com/featured/200x200"
		alt=""
	/>
	<div class="p-5">
		<h5
			class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white cursor-auto"
			on:click|stopPropagation
			on:keypress|stopPropagation
		>
			Noteworthy technology acquisitions 2021
		</h5>
		<p
			class="mb-3 font-normal text-gray-700 dark:text-gray-400 cursor-auto"
			on:click|stopPropagation
			on:keypress|stopPropagation
		>
			Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
			chronological order.
		</p>
		<div
			class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Read more

			<img src="arrow.svg" class="w-4 h-4 ml-2 -mr-1" alt="arrow" />
		</div>
	</div>
</div>

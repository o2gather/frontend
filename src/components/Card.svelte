<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let description: string;
	export let link: string;
</script>

<div
	on:click={() => goto(link)}
	on:keypress={() => goto(link)}
	class="h-full cursor-pointer rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
>
	<div class="flex h-full flex-col p-8">
		<h5
			class="mb-8 cursor-auto text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
			on:click|stopPropagation
			on:keypress|stopPropagation
		>
			{title}
		</h5>
		<p
			class="mb-10 line-clamp-2 grow cursor-auto font-normal text-gray-600 dark:text-gray-400"
			on:click|stopPropagation
			on:keypress|stopPropagation
		>
			{description}
		</p>
		<div class="flex flex-wrap justify-end gap-y-2">
			<div
				class="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Read more

				<img src="/arrow.svg" class="-mr-1 ml-2 h-4 w-4" alt="arrow" />
			</div>
			<div class="grow text-right">
				<div
					class="inline-flex items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Join

					<img src="/plus.svg" class="-mr-1 ml-2 h-4 w-4" alt="plus" />
				</div>
			</div>
		</div>
	</div>
</div>

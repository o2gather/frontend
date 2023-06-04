<script>
	import { user } from './../stores/user';
	import { loggedIn } from '../stores/loggedIn';
	import GoogleLogin from './GoogleLogin.svelte';
	import { auth } from '../stores/auth';

	let isOpen = false;
</script>

<svelte:window
	on:click={() => {
		isOpen = false;
	}}
/>
{#if $loggedIn}
	<div class="flex flex-col items-end justify-center">
		<button
			type="button"
			class="relative mr-2 flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
			on:click={(e) => {
				e.stopPropagation();
				isOpen = !isOpen;
			}}
		>
			<img class="h-6 w-6 rounded-full" src={$user?.avatar} alt="avatar" />
			<span class="ml-2">{$user?.name}</span>

			<div
				class="absolute top-0 z-50 mt-10 max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow transition-opacity dark:border-gray-700 dark:bg-gray-800 md:top-0
			{isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}"
			>
				<div class="flex flex-col items-center">
					<img class="h-20 w-20 rounded-full" src={$user?.avatar} alt="avatar" />
					<h5 class="my-1 text-xl font-medium text-gray-900 dark:text-white">{$user?.name}</h5>
					<span class="text-sm text-gray-500 dark:text-gray-400">{$user?.email}</span>
					<div class="mt-4 flex w-full flex-col space-y-2">
						<button
							type="button"
							class="mb-2 mr-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
							on:click={() => {
								auth.reset();
							}}>Logout</button
						>
					</div>
				</div>
			</div>
		</button>
	</div>
{:else}
	<GoogleLogin />
{/if}

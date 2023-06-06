<script lang="ts">
	import { goto } from '$app/navigation';
	import { testid } from '../actions/testid';
	import { loggedIn } from '../stores/loggedIn';
	import UserStatus from './UserStatus.svelte';

	let isMenuOpen = false;
</script>

<nav class="border-gray-200 bg-white">
	<div class="justify-betwee mx-6 my-6 flex flex-wrap items-center md:mx-36">
		<div class="grow">
			<a href="/" class="inline-flex items-center" data-sveltekit-preload-data="off">
				<img
					src="https://www.svgrepo.com/show/498281/people.svg"
					class="mr-3 h-8"
					alt="Flowbite Logo"
				/>
				<span class="self-center whitespace-nowrap text-2xl font-semibold">O2Gather</span>
			</a>
		</div>
		<button
			on:click={() => {
				isMenuOpen = !isMenuOpen;
			}}
			type="button"
			class="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
			aria-controls="navbar-default"
			aria-expanded="false"
		>
			<span class="sr-only">Open main menu</span>
			<svg
				class="h-6 w-6"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
		<div class="w-full md:block md:w-auto" id="navbar-default" class:hidden={!isMenuOpen}>
			<ul
				class="mt-4 flex flex-col items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-6 font-medium md:mt-0 md:flex-row md:items-center md:gap-0 md:space-x-8 md:border-0 md:bg-white md:p-0"
			>
				{#if $loggedIn}
					<li>
						<a
							href="/?filter=organized"
							class="block rounded text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
							use:testid={'navbar-organized'}>Organized</a
						>
					</li>
					<li>
						<a
							href="/?filter=joined"
							class="block rounded text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
							use:testid={'navbar-joined'}>Joined</a
						>
					</li>
					<li>
						<div
							on:click={() => goto('/events/create')}
							on:keypress={() => goto('/events/create')}
							class="inline-flex cursor-pointer items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
						>
							Create Event

							<img src="/plus.svg" class="-mr-1 ml-2 h-4 w-4" alt="plus" />
						</div>
					</li>
				{/if}
				<li>
					<UserStatus />
				</li>
			</ul>
		</div>
	</div>
</nav>

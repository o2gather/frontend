<script>
	import { api } from './../api';
	import { browser } from '$app/environment';
	import Navbar from '../components/Navbar.svelte';
	import { auth } from '../stores/auth';
	import { loading } from '../stores/loading';
	import { Circle3 } from 'svelte-loading-spinners';

	if (browser) {
		if ($auth.userId) {
			api.loading
				.getUserInfo({
					params: {
						userId: $auth.userId
					},
					withCredentials: true
				})
				.then((res) => {
					auth.setUser(res);
				})
				.catch((err) => {
					auth.logout();
					console.log(err);
				});
		}
	}
</script>

<svelte:head>
	<title>O2Gather</title>
	<meta name="description" content="O2Gather App" />
</svelte:head>

<header>
	<Navbar />
</header>

<main class="mx-auto max-w-[1440px]">
	<slot />
</main>

{#if $loading}
	<div
		class="fixed left-0 top-0 flex h-full w-full select-none items-center justify-center bg-gray-300 bg-opacity-30"
	>
		<Circle3 />
	</div>
{/if}

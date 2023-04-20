<script>
	import Navbar from '../components/Navbar.svelte';
	import { loading } from '../stores/loading';
	import { Circle3 } from 'svelte-loading-spinners';
</script>

<svelte:head>
	<title>O2Gather</title>
	<meta name="description" content="O2Gather App" />
</svelte:head>

<header>
	<Navbar />
</header>

<main>
	<slot />
</main>

{#if $loading}
	<div
		class="fixed left-0 top-0 flex h-full w-full select-none items-center justify-center bg-gray-300 bg-opacity-30"
	>
		<Circle3 />
	</div>
{/if}

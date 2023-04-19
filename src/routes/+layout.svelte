<script>
	import Navbar from '../components/Navbar.svelte';
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

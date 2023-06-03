<script lant="ts">
	import { page } from '$app/stores';
</script>

<div class="flex h-[calc(100vh-500px)] flex-col items-center justify-center">
	<div class="text-2xl font-bold text-gray-400">Error</div>
	<div class="text-xl text-gray-400">{$page.error?.message}</div>
</div>

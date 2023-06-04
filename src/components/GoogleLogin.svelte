<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const script = document.createElement('script');

		script.async = true;
		script.src = '//accounts.google.com/gsi/client';

		document.head.appendChild(script);

		return {
			destroy() {
				document.head.removeChild(script);
			}
		};
	});
</script>

<div
	id="g_id_onload"
	data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
	data-context="signin"
	data-ux_mode="popup"
	data-login_uri={import.meta.env.VITE_GOOGLE_LOGIN_URI}
	data-itp_support="true"
/>

<div
	class="g_id_signin"
	data-type="standard"
	data-shape="rectangular"
	data-theme="outline"
	data-text="signin_with"
	data-size="large"
	data-logo_alignment="left"
	data-width="200"
/>

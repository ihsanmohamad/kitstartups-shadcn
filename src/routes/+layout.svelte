<script lang="ts">
	import '$styles/app.css';
	import '@fontsource-variable/inter';
	import { ModeWatcher } from "mode-watcher";
	import Toast from '$lib/components/Toast.svelte';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { createToast } from '$lib/components/Toast.svelte';
	import { browser } from '$app/environment';

	const flash = getFlash(page);
	$: if ($flash) {
		if (browser) {
			createToast({
				type: $flash.type,
				title: $flash.title,
				description: $flash.description
			});
		}
	}
</script>

<Toast />
<ModeWatcher />
<slot />

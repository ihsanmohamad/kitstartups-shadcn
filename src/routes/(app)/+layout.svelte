<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from "$lib/components/ui/button";
	import { Sun, Moon } from "lucide-svelte";
	import { toggleMode } from "mode-watcher";
	export let data;
</script>

<div class="w-full border-b">
	<nav class="flex justify-between py-2 max-w-5xl mx-auto px-4 items-center">
		<a href="/">Home</a>
	
		<div class="flex gap-2 items-center">
			{#if data.user}
				<a href="/app/profile">Profile</a>
	
				<form method="post" action="/auth/login?/logout" use:enhance>
					<button type="submit">Log Out</button>
				</form>
			{:else}
				<Button href="/auth/signup">Sign Up</Button>
				<Button variant="ghost" href="/auth/login">Login</Button>
			{/if}
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
				<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</nav>
</div>

<main class="py-16 max-w-5xl mx-auto px-4">
	<slot />
</main>

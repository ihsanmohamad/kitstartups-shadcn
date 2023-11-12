<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
</script>
<main class="flex flex-col items-center justify-center min-h-screen">
	<!-- <Button href="/" class="self-start ml-32" variant="secondary">Back</Button> -->
	<section class="w-10/12 space-y-8 lg:w-4/12">
		<slot />
	</section>
</main>

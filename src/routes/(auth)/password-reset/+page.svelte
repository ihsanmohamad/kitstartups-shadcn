<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { resetUserSchema, type ResetUserForm } from '$lib/drizzle/postgres/zodSchema.js';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as flashModule from 'sveltekit-flash-message/client';

	export let data;
	let form: SuperValidated<ResetUserForm> = data?.form;
	let running = false;
</script>

<svelte:head>
	<title>Get a reset link</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Get a reset link</h1>
</div>
<Form.Root
	method="POST"
	action="?/sendPasswordResetLink"
	options={{
		flashMessage: {
			module: flashModule,
			onError: ({ message }) => {
				message.set({
					type: 'error',
					title: 'Something Happened',
					description: 'An unknown error occurred. Please try again later.'
				});
			}
		},
		onSubmit: () => {
			running = true;
		},
		onResult: () => {
			running = false;
		},
		delayMs: 500,
		timeoutMs: 8000
	}}
	{form}
	schema={resetUserSchema}
	let:config
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Send reset link</Card.Title>
		</Card.Header>
		<Card.Content>
			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Email *</Form.Label>
					<Form.Input placeholder="Your email" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button {running} class="w-full">Email password reset link</Form.Button>
		</Card.Footer>
	</Card.Root>
</Form.Root>

{#if !data.user}
	<p class="text-sm text-center text-secondary-foreground">
		Already have an account? <a
			href="/auth/login"
			class="font-medium text-primary hover:underline">Login instead</a
		>
	</p>
{/if}

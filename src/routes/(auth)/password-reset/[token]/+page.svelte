<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { resetPasswordSchema, type ResetPasswordForm } from '$lib/drizzle/postgres/zodSchema.js';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as flashModule from 'sveltekit-flash-message/client';

	export let data;
	let form: SuperValidated<ResetPasswordForm> = data?.form;
	let running = false;
	
</script>
<svelte:head>
	<title>Reset your password</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Reset your password</h1>
</div>

<Form.Root
	method="POST"
	action="?/resetPassword"
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
	schema={resetPasswordSchema}
	let:config
>
<Card.Root>
	<Card.Header>
		<Card.Title>Reset password</Card.Title>
	</Card.Header>
	<Card.Content>
		<Form.Field {config} name="password">
			<Form.Item>
				<Form.Label>Password *</Form.Label>
				<Form.Input placeholder="Your password" type="password" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</Card.Content>
	<Card.Footer>
		<Form.Button {running} class="w-full">Reset your password</Form.Button>
	</Card.Footer>
</Card.Root>
</Form.Root>
<div class="text-center">
	<p class="text-sm text-secondary-foreground">
		Already have an account? <a href="/auth/login" class="font-medium text-primary hover:underline"
			>Login instead</a
		>
	</p>
</div>

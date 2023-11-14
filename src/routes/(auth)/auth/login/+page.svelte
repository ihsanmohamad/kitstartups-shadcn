<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { loginUserSchema, type LoginUserForm } from '$lib/drizzle/postgres/zodSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	export let data: PageData;
	import * as flashModule from 'sveltekit-flash-message/client';

	let form: SuperValidated<LoginUserForm> = data?.form;
	let running = false;
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Welcome back</h1>
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>Login into your account</Card.Title>
	</Card.Header>
	<Card.Content>
		<Form.Root
			method="POST"
			action="?/loginUser"
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
				onResult: (e) => {
					running = false;
				},
				delayMs: 500,
				timeoutMs: 8000
			}}
			{form}
			schema={loginUserSchema}
			let:config
		>
			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Email</Form.Label>
					<Form.Input placeholder="Your email" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input placeholder="Your password" type="password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<!-- <div class="flex flex-col">
			<label for="password">Password</label>
			<input type="password" name="password" placeholder="Your password" />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'password')} />

		
		</div> -->
			<div class="flex flex-col gap-2">
				<a
					href="/password-reset"
					class="text-xs font-medium text-right self-end max-w-max text-primary hover:underline"
				>
					Forgot your password?
				</a>
				<Form.Button {running} class="w-full">Login</Form.Button>
			</div>
			<!-- <Button {running} type="submit" class="w-full">Login</Button> -->
		</Form.Root>
	</Card.Content>
	<Card.Footer class="text-center flex flex-col gap-3">
		<Button href="/api/oauth/github" class="w-full" variant="outline">Login with GitHub</Button>
		<Button href="/api/oauth/google" class="w-full" variant="outline">Login with Google</Button>
	</Card.Footer>
</Card.Root>

<p class="text-sm text-secondary-foreground">
	You don't have an account yet? <a
		href="/auth/signup"
		class="font-medium text-primary hover:underline">Create one</a
	>
</p>

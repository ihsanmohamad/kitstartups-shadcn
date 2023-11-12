<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Form from '$lib/components/ui/form';

	import type { SuperValidated } from "sveltekit-superforms";
	import type { PageData } from './$types';
	export let data: PageData;
	import * as flashModule from 'sveltekit-flash-message/client';
	import { signupUserSchema, type SignUpUserForm } from "$lib/drizzle/postgres/zodSchema";

	let form: SuperValidated<SignUpUserForm> = data?.form;
	let running = false;
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Sign Up</h1>
</div>

<Form.Root method="POST" action="?/signupUser" options={{
	flashMessage: {
		module: flashModule,
		onError: ({message}) => {
			message.set({type: 'error', title: 'Something Happened', description: 'An unknown error occurred. Please try again later.'});
		},
	},
	onSubmit: () => {
		running = true
	},
	onResult: (e) => {
		running = false
	},
	delayMs: 500,
	timeoutMs: 8000,
}} {form} schema={signupUserSchema} let:config>
<Card.Root>
	<Card.Header>
		<Card.Title>Get Started with KitForStartups</Card.Title>
	</Card.Header>
	<Card.Content>
		<Form.Field {config} name="firstName">
			<Form.Item>
				<Form.Label>First Name</Form.Label>
				<Form.Input placeholder="Your first name" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="lastName">
			<Form.Item>
				<Form.Label>Last Name</Form.Label>
				<Form.Input placeholder="Your last name" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label>Email</Form.Label>
				<Form.Input type="email" placeholder="Your email address" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="password">
			<Form.Item>
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" placeholder="Your password" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</Card.Content>
	<Card.Footer>
		<Form.Button {running}  class="w-full">Sign Up</Form.Button>
	</Card.Footer>
</Card.Root>
</Form.Root>

<div class="text-center">
	<p class="text-sm text-gray-600">
		Already have an account? <a href="/auth/login" class="font-medium text-primary hover:underline"
			>Login instead</a
		>
	</p>
</div>

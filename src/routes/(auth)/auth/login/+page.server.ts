import type { PageServerLoad } from "./$types";
import { auth } from '$lib/lucia/postgres';
import { fail} from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server'

import { superValidate } from "sveltekit-superforms/server";
import { LuciaError } from 'lucia';
import { loginUserSchema } from '$lib/drizzle/postgres/zodSchema';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/app/profile');
	}

	return {form: superValidate(loginUserSchema)};
};



export const actions = {
	loginUser: async (event) => {
		const form = await superValidate(event, loginUserSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { email, password } = form.data;

		try {
			const user = await auth.useKey('email', email, password);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// Set session cookie
			event.locals.auth.setSession(session);
			setFlash({ type: 'success', title: 'Login success', description: 'Logged In' }, event);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
			
				setFlash({ type: 'error', title: 'Login failed', description: 'Incorrect email or password.' }, event);
				return fail(400, { form });
			}

			setFlash({ type: 'error', title: 'Login failed', description: 'An unknown error occurred. Please try again later.' }, event);

			return fail(500, {
				form
			});
		}

		throw redirect(302, '/app/profile');
	},

	logout: async (event) => {
		const session = await event.locals.auth.validate();

		if (!session) {
			setFlash({ type: 'error', title: 'Unauthorized', description: 'You are not authorized to perform this action.' }, event);
			return fail(401);
		}

		// Invalidate session
		await auth.invalidateSession(session.sessionId);

		// Remove session cookie
		event.locals.auth.setSession(null);

		// Remove OAuth cookies
		event.cookies.delete('github_oauth_state');
		event.cookies.delete('google_oauth_state');

		setFlash({ type: 'success', title: 'Account Logged Out', description: 'You are logged out' }, event);
		throw redirect(302, '/auth/login');
	}
};

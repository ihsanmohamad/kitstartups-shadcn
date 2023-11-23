import { validatePasswordResetToken } from '$lib/drizzle/postgres/models/tokens';
import { auth } from '$lib/lucia/postgres';
import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "./$types";
import { resetPasswordSchema } from '$lib/drizzle/postgres/zodSchema';
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/app/profile');
	}

	return {form: superValidate(resetPasswordSchema)};
};

export const actions = {
	resetPassword: async (event) => {
		const form = await superValidate(event, resetPasswordSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { password } = form.data;

		try {
			const { token } = event.params;
			const userId = await validatePasswordResetToken(token);
			let user = await auth.getUser(userId);

			if (!user) {
				setFlash({ type: 'error', title: 'Invalid or expired password reset link', description: 'Please try again.' }, event);
				return fail(400, {
					form
				});
			}

			// Invalidate all sessions and update the password
			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('email', user.email, password);

			// If the user has not verified their email, verify it now
			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(user.userId, {
					email_verified: true
				});
			}

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			event.locals.auth.setSession(session);
		} catch (e) {
			setFlash({ type: 'error', title: 'Invalid reset link', description: 'Your password reset link is invalid or has expired. Please try again..' }, event);
			return fail(400, {
				form
			});
		}

		throw redirect(302, '/app/profile');
	}
};

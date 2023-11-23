import { TRANSACTIONAL_EMAILS_ADDRESS, TRANSACTIONAL_EMAILS_SENDER } from '$env/static/private';
import { generatePasswordResetToken } from '$lib/drizzle/postgres/models/tokens';
import { getUserByEmail, getUserProfileData } from '$lib/drizzle/postgres/models/users';
import { sendEmail } from '$lib/emails/send';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from "sveltekit-superforms/server";
import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { resetUserSchema } from '$lib/drizzle/postgres/zodSchema';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/app/profile');
	}

	return {form: superValidate(resetUserSchema)};
};


export const actions = {
	sendPasswordResetLink: async (event) => {
		const form = await superValidate(event, resetUserSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const { email } = form.data;
			const storedUser = await getUserByEmail(email);
	
			if (!storedUser) {
				setFlash({ type: 'error', title: 'Invalid email', description: 'The email you entered does not match any account.' }, event);
				return fail(400, {
					form
				});
			}
	
			const profile = await getUserProfileData(storedUser.id);
	
			try {
				const resetToken = await generatePasswordResetToken(storedUser.id);
	
				const sender = `${TRANSACTIONAL_EMAILS_SENDER} <${TRANSACTIONAL_EMAILS_ADDRESS}>`;
				const recipient = profile?.firstName ? `${profile.firstName}` : storedUser.email;
				const emailHtml = `Hello ${recipient},<br><br>Here is your password reset link:<br><br><a href="${event.url.origin}/password-reset/${resetToken}">Reset Password</a><br><br>Thanks,<br>${TRANSACTIONAL_EMAILS_SENDER}`;
	
				const passwordResetEmail = await sendEmail({
					from: sender,
					to: storedUser.email as string,
					subject: 'Password Reset',
					html: emailHtml
				});
	
				if (passwordResetEmail[0].type === 'error') {
					setFlash({ type: 'error', title: 'Error', description: 'Unable to reset' }, event);
					return fail(500, { form });
				}
			} catch (error) {
				setFlash({ type: 'error', title: 'Error sending email', description: 'An unknown error occurred while sending the email. Please try again later.' }, event);
				return fail(500, { form} );
			}
		} catch (err) {
			throw error(500);
		}
		setFlash({ type: 'success', title: 'Email Sent', description: 'Please check your email.' }, event);
	}
};

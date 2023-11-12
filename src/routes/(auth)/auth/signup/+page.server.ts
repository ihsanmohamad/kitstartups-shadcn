import { TRANSACTIONAL_EMAILS_ADDRESS, TRANSACTIONAL_EMAILS_SENDER } from '$env/static/private';
import { generateEmailVerificationToken } from '$lib/drizzle/postgres/models/tokens';
import { updateUserProfileData } from '$lib/drizzle/postgres/models/users';
import { signupUserSchema } from '$lib/drizzle/postgres/zodSchema';
import { sendEmail } from '$lib/emails/send';
import { auth } from '$lib/lucia/postgres';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/app/profile');
	}

	return {form: superValidate(signupUserSchema)};
};


export const actions = {
	signupUser: async (event) => {
		const form = await superValidate(event, signupUserSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { firstName, lastName, email, password } = form.data;

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password // this is hashed by Lucia
				},
				attributes: {
					email,
					email_verified: false
				}
			});

			// Update user profile data
			await updateUserProfileData({
				id: nanoid(),
				userId: user.userId,
				firstName,
				lastName
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// Set session cookie
			event.locals.auth.setSession(session);

			// Send verification email
			const verificationToken = await generateEmailVerificationToken(user.userId);

			const sender = `${TRANSACTIONAL_EMAILS_SENDER} <${TRANSACTIONAL_EMAILS_ADDRESS}>`;
			const recipient = firstName ? `${firstName}` : email;
			const emailHtml = `Hello ${recipient},
			<br><br>
			Thank you for signing up to KitForStartups! Please click the link below to verify your email address:
			<br><br>
			<a href="${event.url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a>
			<br>
			You can also copy directly into your browser:
			<br><br>
			<code>${event.url.origin}/app/email-verification/${verificationToken}</code>
			<br><br>
			Thanks,
			<br>
			${TRANSACTIONAL_EMAILS_SENDER}`;

			const signupEmail = await sendEmail({
				from: sender,
				to: email,
				subject: 'Verify Your Email Address',
				html: emailHtml
			});

			if (signupEmail[0].type === 'error') {
				setFlash({ type: 'error', title: 'Error', description: 'Unable to send email, please contact support for help.' }, event);
				return fail(500, {
					form
				});
			}
		} catch (e) {
			console.error(e);

			setFlash({ type: 'error', title: 'Unknown error', description: 'An unknown error occurred. Please try again.' }, event);
			return fail(500, {
				form
			});
		}
		setFlash({ type: 'success', title: 'Account created', description: 'Please check your email for confirmation.' }, event);
		throw redirect(302, '/app/email-verification');
	}
};

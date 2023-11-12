import { auth } from '$lib/lucia/postgres';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';



export const authorization: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};

export const handle = sequence(authorization);


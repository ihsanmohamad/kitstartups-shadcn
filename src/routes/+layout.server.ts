import { loadFlash } from 'sveltekit-flash-message/server';

// /** @type {import('./$types').LayoutServerLoad} */
export const load = loadFlash(async ({locals}) => {
	const session = await locals.auth.validate();

	return {
		user: session?.user
	};
});

/// <reference types="lucia" />

declare global {
	namespace Lucia {
		type Auth = import('$lib/lucia/postgres').Auth;
		type DatabaseUserAttributes = {
			email: string;
			email_verified: boolean
			github_username?: string;
		};
		type DatabaseSessionAttributes = object;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; title: string ; description: string };
		}
		// interface Platform {}
	}
}

export { };


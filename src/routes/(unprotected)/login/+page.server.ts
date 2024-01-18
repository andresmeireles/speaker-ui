import { UNPROTECTED_API_URLS } from '$lib';
import {
	DAYS_PER_WEEK,
	HOURS_PER_DAY,
	MINUTES_PER_HOUR,
	SECONDS_PER_MINUTE
} from '$lib/interfaces/dates';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		if (email === '' || email.trim().length === 0) {
			return fail(400, { email, message: 'Email must be provided', error: true });
		}

		const req = await fetch(UNPROTECTED_API_URLS.LOGIN, {
			method: 'POST',
			body: JSON.stringify({
				email
			})
		});
		if (!req.ok) {
			return fail(400, { email, message: await req.text(), error: true });
		}

		return { doLogin: true, email, loginMessage: await req.text() };
	},
	confirm: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const code = formData.get('code')?.toString();
		const email = formData.get('email')?.toString();
		const remember = formData.get('remember')?.toString() === 'on' ?? false;
		const values = { code, email, remember };

		if (code?.trim().length === 0) {
			return fail(400, { values, message: 'Code cannot be empty', error: true });
		}

		const req = await fetch(`${UNPROTECTED_API_URLS.LOGIN}/confirm`, {
			method: 'POST',
			body: JSON.stringify({
				code,
				email,
				remember
			})
		});
		if (!req.ok) {
			return fail(400, { values, message: await req.text(), error: true });
		}

		const maxAge = remember
			? SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK * 2
			: undefined;
		const response = await req.json();
		cookies.set('session_id', response.token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge
		});

		throw redirect(303, '/');
	}
} satisfies Actions;

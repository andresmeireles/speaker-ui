import { PROTECTED_API_URLS } from '$lib';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const template = formData.get('template')?.toString();
		const remember = formData.get('remember')?.toString();
		const values = { template, remember };

		if (template?.trim().length === 0) {
			return fail(400, { values, tplError: true });
		}

		const req = await fetch(PROTECTED_API_URLS.CONFIGS, {
			method: 'POST',
			body: JSON.stringify([
				{
					name: 'template',
					value: template
				},
				{
					name: 'remember',
					value: remember
				}
			])
		});

		if (!req.ok) {
			return fail(400, { values, tplError: true });
		}

		return { success: true };
	}
} satisfies Actions;

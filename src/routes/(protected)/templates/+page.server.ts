import { PROTECTED_API_URLS, type ServerConfig } from '$lib';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const configs = await fetch(`${PROTECTED_API_URLS.CONFIGS}`);
		if (!configs.ok) {
			throw new Error(configs.statusText);
		}
		const data = await configs.json() as ServerConfig[];
        const conf: Record<string, string|number> = {}
        data.map((d: ServerConfig) => conf[d.name] = d.value);

        return conf
	} catch (error) {
		return {};
	}
};

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

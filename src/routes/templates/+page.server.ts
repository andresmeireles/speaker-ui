import { URLS } from '$lib'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, fetch }) => {
        const formData = await request.formData()
        const template = formData.get('template')?.toString()

        if (template?.trim().length === 0) {
            return fail(400, { template, tplError: true })
        }

        const req = await fetch(
            URLS.CONFIGS,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: "template",
                    value: template
                })
            }
        );

        if (!req.ok) {
            return fail(400, { template, tplError: true })
        }

        return { success: true }
    }
} satisfies Actions
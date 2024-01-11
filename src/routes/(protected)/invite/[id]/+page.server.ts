import { PROTECTED_API_URLS, type ApiInvite } from "$lib";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
	const id = params.id;
	const inviteRequest = await fetch(`${PROTECTED_API_URLS.INVITES}/${id}`);
	if (!inviteRequest.ok) {
		throw redirect(302, '/invites');
	}
	const invite: ApiInvite = await inviteRequest.json();
	return {
		invite
	};
}

export const actions = {
	updateInvite: async ({ request, fetch, params }) => {
		const { id } = params
		const formData = await request.formData();
		let date = formData.get('date')?.toString();
		const theme = formData.get('theme')?.toString();
		const time = formData.get('time')?.toString();
		const references = formData.get('references')?.toString();
		const values = { id, date, theme, time, references };

		if (date === null || date === undefined || date.trim().length === 0) {
			return fail(400, { values, noDate: true });
		}

		if (time === null || time === undefined || time.trim().length === 0) {
			return fail(400, { values, noTime: true });
		}

		if (theme === null || theme === undefined || theme.trim().length === 0) {
			return fail(400, { values, noTheme: true });
		}

		if (references === null || references === undefined || references.trim().length === 0) {
			return fail(400, { values, noReferences: true });
		}

		date = new Date(date).toISOString();
		const req = await fetch(`${PROTECTED_API_URLS.INVITES}/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				date,
				theme,
				time: parseInt(time),
				references
			})
		});

		if (!req.ok) {
			return fail(400, { values, reqFail: true });
		}

		return { updateSuccess: true };
	}
} satisfies Actions
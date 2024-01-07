import { PROTECTED_API_URLS } from "$lib";
import { fail, type Actions } from "@sveltejs/kit";

export const actions = {
    updateInvite: async ({ request, fetch, params }) => {
		const { id } = params
		const formData = await request.formData();
		let date = formData.get('date')?.toString();
		const theme = formData.get('theme')?.toString();
		const time = formData.get('time')?.toString();
		const references = formData.get('references')?.toString();
		const updateValues = { id, date, theme, time, references };

		if (date === null || date === undefined || date.trim().length === 0) {
			return fail(400, { updateValues, noDate: true });
		}

		if (time === null || time === undefined || time.trim().length === 0) {
			return fail(400, { updateValues, noTime: true });
		}

		if (theme === null || theme === undefined || theme.trim().length === 0) {
			return fail(400, { updateValues, noTheme: true });
		}

		if (references === null || references === undefined || references.trim().length === 0) {
			return fail(400, { updateValues, noReferences: true });
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
			return fail(400, { updateValues, reqFail: true });
		}

		return { updateSuccess: true };
	}
} satisfies Actions
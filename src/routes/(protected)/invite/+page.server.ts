import { PROTECTED_API_URLS } from "$lib";
import { fail, type Actions } from "@sveltejs/kit";

export const actions = {
    createInvite: async ({ request, fetch }) => {
		const formData = await request.formData();
		const personId = formData.get('person_id')?.toString();
		let date = formData.get('date')?.toString();
		const theme = formData.get('theme')?.toString();
		const time = formData.get('time')?.toString();
		const references = formData.get('references')?.toString();
		const values = { personId, date, theme, time, references };

		if (
			personId === null ||
			personId === undefined ||
			personId.trim().length === 0 ||
			personId === '0'
		) {
			return fail(400, { values, noSpeaker: true });
		}

		if (date === null || date === undefined || date.trim().length === 0) {
			return fail(400, { values, noDate: true });
		}

		if (time === null || time === undefined || time.trim().length === 0) {
			return fail(400, { values, noTime: true });
		}

		date = new Date(date).toISOString();
		const req = await fetch(PROTECTED_API_URLS.INVITES, {
			method: 'POST',
			body: JSON.stringify({
				person_id: parseInt(personId),
				date,
				theme,
				time: parseInt(time),
				references
			})
		});

		if (!req.ok) {
			return fail(400, { values, reqFail: true });
		}

		return { success: true };
	}
} satisfies Actions
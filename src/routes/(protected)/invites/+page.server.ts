import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PROTECTED_API_URLS } from '$lib';

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
	},
	removeInvite: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (id === null || id === undefined || id.trim().length === 0) {
			return fail(400, { id, noId: true });
		}

		console.log(`${PROTECTED_API_URLS.INVITES}/${id}`);
		const req = await fetch(`${PROTECTED_API_URLS.INVITES}/${id}`, {
			method: 'DELETE'
		});

		if (!req.ok) {
			return fail(400, { id, reqFail: true });
		}

		return { inviteRemoved: true };
	},
	trigger: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const isInvite = formData.get('isInvite')?.toString() === 'true';

		if (id === null || id === undefined || id.trim().length === 0) {
			return fail(400, { id, noId: true });
		}

		let req: Response;
		if (isInvite) {
            console.log("run accept", isInvite)
			req = await fetch(`${PROTECTED_API_URLS.INVITES}/accept/${id}`, {
				method: 'PUT',
				body: JSON.stringify({
					accepted: true
				})
			});
		} else {
            console.log("run remember", isInvite)
			req = await fetch(`${PROTECTED_API_URLS.INVITES}/remember/${id}`, {
				method: 'PUT',
				body: JSON.stringify({
					accepted: true
				})
			});
		}

		if (!req.ok) {
			console.log(req.text);
			return fail(400, { id, confirmReqFail: true });
		}

		return { inviteConfirmed: true, requestResponseMessage: await req.text() };
	}
} satisfies Actions;

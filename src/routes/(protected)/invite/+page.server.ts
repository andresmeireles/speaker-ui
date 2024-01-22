import { PROTECTED_API_URLS, type Speaker } from "$lib";
import { fail, type Actions } from "@sveltejs/kit";

type FETCH = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>

export const load = async ({ fetch, url }) => {
	const id = url.searchParams.get('id');
	const people = await fetch(PROTECTED_API_URLS.SPEAKERS,);
	if (!people.ok) {
		return {
			error: true,
			message: 'Something went wrong',
		}
	}
    
	const peopleJson: Speaker[] = await people.json();

	return { people: peopleJson, id };
}

export const actions = {
	accept: async ({ fetch, request }) => updateInvite({ fetch, request, path: `${PROTECTED_API_URLS.INVITES}/accept` }),
	remember: async ({ fetch, request }) => updateInvite({ fetch, request, path: `${PROTECTED_API_URLS.INVITES}/remember` }),
	remove: async ({ fetch, request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const req = await fetch(`${PROTECTED_API_URLS.INVITES}/${id}`, {
			method: 'DELETE'
		});
		
		if (!req.ok) {
			return fail(400, { id, reqFail: true });
		}

		return {
			success: true
		}
	},
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

const updateInvite = async ({ request, fetch, path }: { request: Request; fetch: FETCH, path: string }) => {
	const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '0';
		const req = await fetch(path + "/" + id, {
			method: 'PUT',
		});
		if (!req.ok) {
			return fail(400, { id, fail: true });
		}
		return {
			success: true
		}
}
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PROTECTED_API_URLS, type ApiInvite, type Invite } from '$lib';


export const load: PageServerLoad = async ({ fetch, locals }) => {
    try {
        const invites = await fetch(PROTECTED_API_URLS.INVITES);
        if (!invites.ok) {
            return fail(400);
        }

        const apiInvitesJson: ApiInvite[] = await invites.json();
        const invitesJson: Invite[] = apiInvitesJson.map((i: ApiInvite) => {
            return {
                id: i.id,
                person: i.person,
                theme: i.theme,
                date: new Date(i.date),
                time: i.time,
                references: i.references,
                accepted: i.accepted,
                remembered: i.remembered
            }
        })

        
        return {
            invites: invitesJson,
			token: locals.token
        }
    } catch (e) {
        return {
            error: true,
            message: 'Something went wrong',
            e
        };
    }
}

export const actions = {
	removeInvite: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (id === null || id === undefined || id.trim().length === 0) {
			return fail(400, { id, noId: true });
		}

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

		console.log(id, isInvite, formData.get('isInvite'))
		
		if (id === null || id === undefined || id.trim().length === 0) {
			return fail(400, { id, noId: true });
		}

		let req: Response;
		if (isInvite) {
			req = await fetch(`${PROTECTED_API_URLS.INVITES}/accept/${id}`, {
				method: 'PUT',
				body: JSON.stringify({
					accepted: true
				})
			});
		} else {
			req = await fetch(`${PROTECTED_API_URLS.INVITES}/remember/${id}`, {
				method: 'PUT',
				body: JSON.stringify({
					accepted: true
				})
			});
		}

		if (!req.ok) {
			return fail(400, { id, confirmReqFail: true });
		}

		return { inviteConfirmed: true, requestResponseMessage: await req.text() };
	}
} satisfies Actions;

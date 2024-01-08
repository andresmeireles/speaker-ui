import { PROTECTED_API_URLS, type ApiInvite } from "$lib";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    const invitesRequest = await fetch(PROTECTED_API_URLS.INVITES);
    if (!invitesRequest.ok) {
        return {
            error: true,
            message: 'Something went wrong',
        }
    }

    const apiInvitesJson: ApiInvite[] = await invitesRequest.json();
    const invites = apiInvitesJson.map((i: ApiInvite) => {
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
        invites
    }
}

export const actions = {
    logout: async ({cookies}) => {
        const r = await fetch(`${PROTECTED_API_URLS.LOGOUT}`, {
            headers: {
                'Cookie': 'session_id='+cookies.get('session_id')
            }
        })
        if (!r.ok) {
            console.warn(await r.text())
            return fail(400, { logoutFail: true })
        }
        cookies.delete('session_id')
        
        throw redirect(302, '/login')
    }
} satisfies Actions
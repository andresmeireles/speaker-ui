import { PROTECTED_API_URLS, type ApiInvite } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, locals }) => {
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
            status: i.status
        }
    })
    
    return {
        invites,
        token: locals.token
    }
}
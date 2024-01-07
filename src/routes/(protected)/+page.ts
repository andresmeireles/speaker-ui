import { PROTECTED_API_URLS, type ApiInvite } from '$lib'

export const load = async ({ fetch }) => {
    const invitesRequest = await fetch(PROTECTED_API_URLS.INVITES, {
        credentials: 'include'
    });
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
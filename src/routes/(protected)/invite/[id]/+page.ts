import { PROTECTED_API_URLS, type ApiInvite } from "$lib";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const id = params.id;
    const inviteRequest = await fetch(`${PROTECTED_API_URLS.INVITES}/${id}`, {
        credentials: 'include'
    });
    if (!inviteRequest.ok) {
        throw redirect(302, '/invites');
    }
    const invite: ApiInvite = await inviteRequest.json();
    return {
        invite
    };
}
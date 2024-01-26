import { PROTECTED_API_URLS, type ApiInvite, type Speaker } from "$lib";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
    const req = await fetch(`${PROTECTED_API_URLS.INVITES}/speaker/${params.id}`)
    if (!req.ok) {
        console.log("invites error", req.status, `${PROTECTED_API_URLS.INVITES}/speaker/${params.id}`)
        throw redirect(302, '/stats');
    }

    const speakerReq = await fetch(`${PROTECTED_API_URLS.SPEAKERS}/${params.id}`);
    if (!speakerReq.ok) {
        console.log("speaker error", speakerReq.status)
        throw redirect(302, '/stats');
    }
    
    const invites: ApiInvite[] = await req.json();
    const speaker: Speaker = await speakerReq.json();

    return {
        invites,
        speaker
    }
}
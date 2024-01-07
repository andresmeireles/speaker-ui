import { fail } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { PROTECTED_API_URLS, type Invite } from "$lib";
import type { ApiInvite } from "$lib/interfaces/invites";

export const load: PageLoad = async ({ fetch }) => {
    try {
        const invites = await fetch(PROTECTED_API_URLS.INVITES, {
            credentials: 'include'
        });
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
            invites: invitesJson
        }
    } catch (e) {
        return {
            error: true,
            message: 'Something went wrong',
            e
        };
    }
}
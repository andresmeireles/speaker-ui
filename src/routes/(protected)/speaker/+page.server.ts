import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { PROTECTED_API_URLS } from "$lib";

export const actions = {
    writeUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();

        console.log("mobral")

        if (speaker?.trim().length === 0) {
            return fail(400, { speaker, noSpeaker: true });
        }

        const req = await fetch(PROTECTED_API_URLS.SPEAKERS, {
            method: 'POST',
            body: JSON.stringify({
                name: speaker
            })
        });

        if (!req.ok) {
            return fail(400, { speaker, reqFail: true });
        }

        return {}
    },
} satisfies Actions
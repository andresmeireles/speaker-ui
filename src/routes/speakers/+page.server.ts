import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { URLS } from '$lib';

export const actions = {
    addUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();

        if (speaker?.trim().length === 0) {
            return fail(400, { speaker, noSpeaker: true });
        }

        const req = await fetch(URLS.SPEAKERS, {
            method: 'POST',
            body: JSON.stringify({
                name: speaker
            })
        });

        if (!req.ok) {
            return fail(400, { speaker, reqFail: true });
        }

        return { success: true }
    },
    removeUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();
        const removeUser = await fetch(URLS.SPEAKERS, {
            method: 'DELETE',
            body: JSON.stringify({
                speaker
            })
        });

        if (!removeUser.ok) {
            console.log(await removeUser.text());
            return fail(400, { speaker, removeFail: true });
        }

        const message = await removeUser.text();

        return { message,  success: true }
    },
} satisfies Actions
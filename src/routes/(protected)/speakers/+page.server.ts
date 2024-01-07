import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PROTECTED_API_URLS } from '$lib';

export const actions = {
    writeUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();

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

        return { success: true }
    },
    updateUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();
        const id = formData.get('id')?.toString() ?? '';

        if (speaker?.trim().length === 0 && id?.trim().length === 0) {
            return fail(400, { speaker, cannotUpdate: true });
        }

        if (id.trim().length === 0) {
            return fail(400, { speaker, noId: true });
        }

        const req = await fetch(`${PROTECTED_API_URLS.SPEAKERS}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: speaker,
              id: parseInt(id)
            })
        });
        if (!req.ok) {
            return fail(400, { speaker, updateFail: true });
        }

        return { successfulyUpdated: true }
    },
    removeUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();
        const removeUser = await fetch(PROTECTED_API_URLS.SPEAKERS, {
            method: 'DELETE',
            body: JSON.stringify({
                speaker
            })
        });

        if (!removeUser.ok) {
            return fail(400, { speaker, removeFail: true });
        }

        const message = await removeUser.text();

        return { message,  success: true }
    },
} satisfies Actions
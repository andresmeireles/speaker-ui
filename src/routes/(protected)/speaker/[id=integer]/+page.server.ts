import { PROTECTED_API_URLS, triggerToastError, type Speaker } from "$lib";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const id = params.id;

    const speakerRequest = await fetch(`${PROTECTED_API_URLS.SPEAKERS}/${id}`);

    if (!speakerRequest.ok) {
        triggerToastError('falha ao encontrar o orador');
        throw redirect(302, '/speakers');
    }

    const speaker: Speaker = await speakerRequest.json();
    
    return {
        speaker
    }
}

export const actions = {
    updateUser: async ({ request, fetch }) => {
        const formData = await request.formData();
        const speaker = formData.get('speaker')?.toString();
        const id = formData.get('id')?.toString() ?? '';

        if (speaker?.trim().length === 0 || id?.trim().length === 0) {
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

        return { successfullyUpdated: true }
    }
} satisfies Actions
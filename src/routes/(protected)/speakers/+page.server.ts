import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PROTECTED_API_URLS, type Person } from '$lib';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const people = await fetch(PROTECTED_API_URLS.SPEAKERS);
		if (!people.ok) {
			return fail(400 );
		}
		const peopleJson: Person[] = await people.json();

		return { 
			speakers: peopleJson
		 };
	} catch (e) {
		return {
			speakers: []
		};
	}
};

export const actions = { 
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

        return { message, successfullyRemoved: true }
    },
} satisfies Actions
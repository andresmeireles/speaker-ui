import { URLS } from '$lib';
import type { Person } from '$lib';
import { fail } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const people = await fetch(URLS.SPEAKERS);
		if (!people.ok) {
			return fail(400);
		}
		const peopleJson: Person[] = await people.json();

		return { 
			speakers: peopleJson
		 };
	} catch (e) {
		return {};
	}
};

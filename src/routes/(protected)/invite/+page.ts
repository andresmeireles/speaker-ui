import { PROTECTED_API_URLS, type Speaker } from "$lib";

export const load = async ({ fetch }) => {
    const people = await fetch(PROTECTED_API_URLS.SPEAKERS, {
        credentials: 'include'
    });
    if (!people.ok) {
        return {
            error: true,
            message: 'Something went wrong',
        }
    }
    
    const peopleJson: Speaker[] = await people.json();

    return { people: peopleJson };
}
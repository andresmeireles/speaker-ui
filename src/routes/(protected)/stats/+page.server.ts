import { PROTECTED_API_URLS, type Stats } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    const request = await fetch(`${PROTECTED_API_URLS.STATS}`);
    if (!request.ok) {
        return {
            error: true,
            stats: []
        }
    }

    const stats: Stats[] = await request.json();

    return {
        stats
    }
}
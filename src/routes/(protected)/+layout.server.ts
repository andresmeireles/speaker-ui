import type { User } from '$lib';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        user: locals.user as User,
        token: locals.token
    };
}

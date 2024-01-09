import { PROTECTED_API_URLS } from '$lib';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, cookies }) => {
    const cookie = cookies.get('session_id');
    cookies.delete('session_id');
	const r = await fetch(`${PROTECTED_API_URLS.LOGOUT}`, {
        headers: {
            'Cookie': `session_id=${cookie}`
        }
    });
	if (!r.ok) {
		throw redirect(302, request.referrer || '/');
	}

	throw redirect(302, '/login');
};

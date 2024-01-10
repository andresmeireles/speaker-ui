import { PUBLIC_APP_MODE, PUBLIC_LOGIN } from '$env/static/public';
import { LOCAL_UNPROTECTED_URLS, PROTECTED_API_URLS, UNPROTECTED_API_URLS, type User } from '$lib';
import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (request.url.startsWith(UNPROTECTED_API_URLS.LOGIN)) {
		return await fetch(request);
	}
	const sessionId = event.cookies.get('session_id');
	if (sessionId) {
		request.headers.set('Cookie', `session_id=${sessionId}`);
	}

	return fetch(request);
}

export const handle: Handle = async ({ event, resolve }) => {
	if (PUBLIC_APP_MODE === 'production' || PUBLIC_LOGIN !== 'disabled') {
		const sessionId = event.cookies.get('session_id');
		if (!sessionId && LOCAL_UNPROTECTED_URLS.includes(event.url.pathname)) {
			return resolve(event);
		}

		if (!sessionId && !LOCAL_UNPROTECTED_URLS.includes(event.url.pathname)) {
			throw redirect(302, '/login');
		}
		
        if (LOCAL_UNPROTECTED_URLS.includes(event.url.pathname)) {
			throw redirect(302, '/');
        }

		const userInfoRequest = await fetch(`${PROTECTED_API_URLS.USERS}/me`, {
            headers: {
                'Cookie': `session_id=${sessionId}`
            }
        });
		if (!userInfoRequest.ok) {
			event.cookies.delete('session_id');
			throw redirect(302, '/login');
		}
		const userInfo: User = await userInfoRequest.json();
		event.locals.user = userInfo;
		event.locals.token = sessionId!;
	}
	
	return resolve(event);
};

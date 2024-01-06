import { PUBLIC_API_URL, PUBLIC_APP_MODE, PUBLIC_LOGIN } from "$env/static/public";
import { LOCAL_UNPROTECTED_URLS, UNPROTECTED_API_URLS } from "$lib";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";

export const handle: Handle = async ({event, resolve}) => {
    if (PUBLIC_APP_MODE === 'prouction' || PUBLIC_LOGIN !== 'disabled') {
        const sessionId = event.cookies.get('session_id');
        if (!sessionId && !LOCAL_UNPROTECTED_URLS.includes(event.url.pathname)) {
            throw redirect(302, '/login');
        }
    }

    // add user data on event.locals

    return resolve(event)
}
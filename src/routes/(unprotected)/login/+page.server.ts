import { UNPROTECTED_API_URLS } from "$lib";
import { DAYS_PER_WEEK, HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from "$lib/interfaces/dates";
import { fail, type Actions, redirect } from "@sveltejs/kit";

export const actions = {
    login: async ({ request, fetch }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();

        if (email?.trim().length === 0) {
            return fail(400, { email, message: 'Email cannot be empty', error: true });
        }

        const req = await fetch(UNPROTECTED_API_URLS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
        if (!req.ok) {
            console.log(UNPROTECTED_API_URLS.LOGIN)
            return fail(400, { email, message: await req.text(), error: true });
        }

        return { doLogin: true, email, loginMessage: await req.text() };
    },
    confirm: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const code = formData.get('code')?.toString();
        const email = formData.get('email')?.toString();
        const stayConnected = formData.get('stay_connected')?.toString() === 'on' ?? false;
        const values = { code, email, stayConnected };


        if (code?.trim().length === 0) {
            return fail(400, { values, message: 'Code cannot be empty', error: true });
        }

        console.log(`${UNPROTECTED_API_URLS.LOGIN}/confirm`);
        const req = await fetch(`${UNPROTECTED_API_URLS.LOGIN}/confirm`, {
            method: 'POST',
            body: JSON.stringify({
                code,
                email
            })
        });
        if (!req.ok) {
            return fail(400, { values,  message: await req.text(), error: true });
        }

        const maxAge = stayConnected ? SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK : undefined;
        const response = await req.json();
        cookies.set('session_id', response.token, {
            httpOnly: true,
            secure: false,
            maxAge
        });

        throw redirect(303, '/');
    }
} satisfies Actions
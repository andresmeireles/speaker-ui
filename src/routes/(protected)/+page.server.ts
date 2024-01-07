import { PROTECTED_API_URLS } from "$lib";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    logout: async ({cookies}) => {
        const r = await fetch(`${PROTECTED_API_URLS.LOGOUT}`, {
            headers: {
                'Cookie': 'session_id='+cookies.get('session_id')
            }
        })
        if (!r.ok) {
            console.warn(await r.text())
            return fail(400, { logoutFail: true })
        }
        cookies.delete('session_id')
        
        throw redirect(302, '/login')
    }
} satisfies Actions
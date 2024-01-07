import { PROTECTED_API_URLS } from "$lib";
import type { Actions } from "./$types";

export const actions = {
    logout: async ({cookies}) => {
        const r = await fetch(`${PROTECTED_API_URLS.LOGOUT}`, {
            headers: {
                'Cookie': 'session_id='+cookies.get('session_id')
            }
        })
        if (!r.ok) {
            console.log(await r.text())
        }
        // cookies.delete('session_id')
        
        // throw redirect(302, '/login')
    }
} satisfies Actions
import { PUBLIC_API_URL } from "$env/static/public";

export const PROTECTED_API_URLS = {
    CONFIGS: `${PUBLIC_API_URL}/configs`,
    SPEAKERS: `${PUBLIC_API_URL}/speakers`,
    INVITES: `${PUBLIC_API_URL}/invites`,
}

export const UNPROTECTED_API_URLS = {
    LOGIN: `${PUBLIC_API_URL}/login`,
}

export const LOCAL_UNPROTECTED_URLS = ['/login']
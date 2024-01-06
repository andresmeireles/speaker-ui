import { PROTECTED_API_URLS, type ServerConfig } from "$lib";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	try {
		const configs = await fetch(`${PROTECTED_API_URLS.CONFIGS}`, {
			credentials: 'include'
		});
		if (!configs.ok) {
			throw new Error(configs.statusText);
		}
		const data = await configs.json() as ServerConfig[];
        const conf: Record<string, string|number> = {}
        data.map((d: ServerConfig) => conf[d.name] = d.value);

        return conf
	} catch (error) {
		return {};
	}
};
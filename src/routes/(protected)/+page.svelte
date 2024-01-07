<script lang="ts">
	import { PROTECTED_API_URLS } from '$lib';

	const name = async () => {
		const res = await fetch(`${PROTECTED_API_URLS.USERS}/me`, {
			credentials: 'include'
		});

		if (!res.ok) {
			console.log(await res.text());
			return;
		}

		const data = await res.json();

		console.log(data);
	};
</script>

<button
	on:click={name}
	class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
	ME
</button>

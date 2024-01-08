<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { triggerToastMessage } from '$lib/actions/toast';
	import type { ActionData } from './$types';
	import Confirm from './components/Confirm.svelte';
	import Login from './components/Login.svelte';

	export let form: ActionData;

	let insertCodePhase = false;
	let options = {};
	let email = '';

	$: form, insertCodePhase, email;
	$: {
		if (form?.error) {
			options = {
				duration: 5000,
				theme: {
					'--toastBackground': '#F56565',
					'--toastProgressBackground': '#C53030'
				}
			};
			triggerToastMessage(form?.message, { options: options });
		}
		if (form?.doLogin) {
			insertCodePhase = true;
			email = form?.email!;
		}
	}
</script>

<div class="w-full h-full">
	{#if insertCodePhase}
		<Confirm {email} {form} />
	{:else}
		<Login />
	{/if}
	<div class="justify-center text-center mt-12">
		<div>api</div>
		<pre>{PUBLIC_API_URL}</pre>
	</div>
</div>

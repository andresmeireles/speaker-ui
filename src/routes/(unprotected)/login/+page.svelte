<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { triggerToastError } from '$lib/actions/toast';
	import type { ActionData } from './$types';
	import Confirm from './components/Confirm.svelte';
	import Login from './components/Login.svelte';

	export let form: ActionData;

	let insertCodePhase = false;
	let email = '';

	$: form, insertCodePhase, email;
	$: {
		if (form?.error) {
			triggerToastError(form?.message);
		}
		if (form?.doLogin) {
			insertCodePhase = true;
			email = form?.email!;
		}
	}
</script>

<div class="h-full w-full">
	{#if insertCodePhase}
		<Confirm {email} {form} />
	{:else}
		<Login />
	{/if}
	<div class="mt-12 justify-center text-center">
		<div>api</div>
		<pre>{PUBLIC_API_URL}</pre>
	</div>
</div>

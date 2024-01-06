<script lang="ts">
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
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
			toast.push(form?.message, options);
		}
		if (form?.doLogin) {
			insertCodePhase = true;
			email = form?.email!;
		}
	}
</script>

<SvelteToast {options} />

{#if insertCodePhase}
	<Confirm {email} {form} />
{:else}
	<Login />
{/if}

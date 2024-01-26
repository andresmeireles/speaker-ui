<script lang="ts">
	import type { ActionData } from './$types';
	import InviteForm from '../components/InviteForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	const invite = {
		...data.invite,
		date: new Date(data.invite.date)
	};
</script>

<InviteForm people={[]} {form} {invite} referer={data.referer ?? ''} />

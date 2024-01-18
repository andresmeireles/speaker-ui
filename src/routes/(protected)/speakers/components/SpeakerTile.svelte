<script lang="ts">
	import type { Speaker } from '$lib';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let speaker: Speaker;

	let cardRef: HTMLDivElement;
	let showOptions = false;

	$: showOptions;

	// events
	const handleOutsideClick = (event: MouseEvent) => {
		if (cardRef && !cardRef.contains(event.target as Node)) {
			showOptions = false;
		}
	};

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
	});

	afterUpdate(() => {
		document.addEventListener('click', handleOutsideClick);
	});
</script>

<div bind:this={cardRef} class="w-full rounded-lg bg-slate-300 p-4">
	<div class="flex justify-between">
		<span class="self-center text-2xl">{speaker.name}</span>
		<button on:click={() => (showOptions = !showOptions)}>
			<i class:hidden={showOptions}><MenuIcon size={3} /></i>
			<i class:hidden={!showOptions}><CloseIcon size={3} /></i>
		</button>
	</div>
	<div>
		<div class="flex flex-col space-y-1">
			<a
				href="/invite?id={speaker.id}"
				class="w-full rounded-lg border border-green-500 bg-green-300 p-2 text-center"
				>criar convite</a
			>
			<a
				href="/stats/{speaker.id}"
				class="w-full rounded-lg border border-blue-600 bg-blue-400 p-2 text-center text-white"
				>ver estatísticas</a
			>
			<form action="">
				<button class="w-full rounded-lg border border-slate-900 bg-red-500 p-2 text-white"
					>remover</button
				>
			</form>
		</div>
	</div>
</div>

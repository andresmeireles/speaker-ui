<script lang="ts">
	import type { TypeAheadOption } from '$lib';
	import { afterUpdate, onMount } from 'svelte';

	// revamp
	let placeholderText: string | null = null;
	export { placeholderText as placeholder };
	export let options: TypeAheadOption[] = [];
	export let selectedOption: TypeAheadOption | null = null;
	export let personId: number;

	// internal variables
	let searchTerm = selectedOption?.name ?? '';
	let show: TypeAheadOption[] = [];
	let optionsContainerRef: HTMLDivElement | null = null;
	let showOptions = !(searchTerm !== '');

	/**
	 * Number of characters to start searching
	 */
	export let searchBeginWith: number = 0;

	const select = (id: number) => {
		console.log(id);
		const selected = options.find((option) => option.id === id);
		if (selected) {
			selectedOption = selected;
			searchTerm = selected.name;
			showOptions = false;
			personId = selected.id;
			// how remove focus from input
			optionsContainerRef?.blur();
			return;
		}
	};

	// state
	$: show,
		personId,
		(show = options.filter(
			(option) =>
				showOptions &&
				searchTerm.trim().length > searchBeginWith &&
				option.name.toLowerCase().includes(searchTerm.toLowerCase())
		));

	// handle outside click
	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
	});

	afterUpdate(() => {
		document.addEventListener('click', handleOutsideClick);
	});

	const handleOutsideClick = (event: MouseEvent) => {
		if (optionsContainerRef && !optionsContainerRef.contains(event.target as Node)) {
			showOptions = false;
			return;
		}

		showOptions = true;
	};
</script>

<div class="relative w-full">
	<ul>
		<li>
			<input
				bind:this={optionsContainerRef}
				bind:value={searchTerm}
				placeholder={placeholderText ?? ''}
				class="w-full bg-slate-100 {show.length === 0 ? 'rounded-lg' : 'rounded-t-lg'}"
				type="text"
			/>
		</li>
		<div class="absolute w-full">
			{#each show as option, index}
				<div
					role="button"
					tabindex={index}
					on:keydown={({ key }) => {
						if (key === 'Enter' || key === ' ') {
							select(index);
						}
					}}
					on:click={() => select(option.id)}
					class="w-full cursor-pointer bg-slate-200 p-2 hover:bg-slate-300 {index ===
					options.length - 1
						? 'rounded-b-lg'
						: ''} {option.id === selectedOption?.id ? 'bg-slate-300' : ''}"
				>
					<li>{option.name}</li>
				</div>
			{/each}
		</div>
	</ul>
</div>

<script lang="ts">
	import type { TypeAheadOption } from '$lib';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

	// internal variables
	let searchTerm = '';
	let show: TypeAheadOption[] = [];
	let optionsContainerRef: HTMLDivElement | null = null;
	let showOptions = true;
	let selectedOption: TypeAheadOption | null = null;
	const dispatch = createEventDispatcher();

	// export values
	let placeholderText: string | null = null;
	export { placeholderText as placeholder };
	export let options: TypeAheadOption[] = [];
	/**
	 * Number of characters to start searching
	 */
	export let searchBeginWith: number = 0;

	const select = (id: number) => {
		const selected = options.find((option) => option.id === id);
		if (selected) {
			selectedOption = selected;
			searchTerm = selected.name;
			showOptions = false;
			// how remove focus from input
			optionsContainerRef?.blur();
			return;
		}
	};

	// state
	$: dispatch('speakerChange', { speaker: selectedOption });
	$: show,
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
		<div class="absolute z-10 w-full">
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
					class="cursor-pointer p-2 w-full bg-slate-200 hover:bg-slate-300 {index ===
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

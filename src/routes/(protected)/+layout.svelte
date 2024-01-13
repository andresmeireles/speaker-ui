<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { writable } from 'svelte/store';
	import type { LayoutData } from './$types';
	import { setContext } from 'svelte';

	const showMenu = writable<boolean>(true);
	const navIsOutOfViewport = writable<boolean>(false);
	setContext('showMenu', showMenu);
	setContext('navIsOutOfViewport', navIsOutOfViewport);

	export let data: LayoutData;

	let loading = true;
	let innerWidth: number;

	$: navIsOutOfViewport;
	$: if (innerWidth) {
		const isMobile = innerWidth < 768;
		if (isMobile) {
			showMenu.set(false);
		}

		loading = false;
	}
</script>

<svelte:window bind:innerWidth />

{#if loading}
	class:fixed={!$showMenu}
	class:h-full={!$showMenu}
	<p>carregando</p>
{:else}
	<Navbar {data} />
	<div class="flex">
		<div
			id="leftsidebar"
			class="flex-grow bg-blue-400 p-5 text-white transition-all duration-500 ease-linear max-sm:hidden"
			class:translate-x-0={$showMenu}
			class:-translate-x-[400%]={!$showMenu}
			class:w-0={!$showMenu}
			class:w-48={$showMenu}
		>
			<div class="sticky top-[10%] whitespace-nowrap transition-all duration-700 ease-linear">
				{data.user.name} + Big Name
			</div>
		</div>
		<div id="content" class="w-full px-3 transition-transform duration-500 ease-linear">
			<slot />
		</div>
	</div>
{/if}

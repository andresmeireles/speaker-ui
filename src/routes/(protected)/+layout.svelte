<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { writable } from 'svelte/store';
	import type { LayoutData } from './$types';
	import { setContext } from 'svelte';

	export let data: LayoutData;

	const menus = [
		{ name: 'Home', href: '/' },
		{ name: 'Pessoas', href: '/speakers' },
		{ name: 'Convites', href: '/invites' },
		{ name: 'Templates', href: '/templates' },
		{ name: 'Estatísticas', href: '/stats' }
	];

	const showMenu = writable<boolean>(true);
	const navIsOutOfViewport = writable<boolean>(false);
	setContext('showMenu', showMenu);
	setContext('navIsOutOfViewport', navIsOutOfViewport);
	setContext('token', data.token);

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
	<!-- class:fixed={!$showMenu}
	class:h-full={!$showMenu}
	<p>carregando</p> -->
{:else}
	<Navbar {data} {menus} />
	<div class="flex md:flex-grow">
		<div
			id="leftsidebar"
			class="flex-grow bg-blue-400 p-5 text-white transition-all duration-500 ease-linear max-sm:hidden"
			class:translate-x-0={$showMenu}
			class:-translate-x-[400%]={!$showMenu}
			class:w-0={!$showMenu}
			class:w-48={$showMenu}
		>
			<div class="sticky top-[10%] whitespace-nowrap transition-all duration-700 ease-linear">
				{#each menus as menu}
					<a href={menu.href} class="block p-2">{menu.name}</a>
				{/each}
			</div>
		</div>
		<div id="content" class="w-full px-3 py-20 transition-transform duration-500 ease-linear">
			<slot />
		</div>
	</div>
{/if}

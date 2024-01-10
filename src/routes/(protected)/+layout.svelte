<script lang="ts">
	import LogoutIcon from '$lib/components/icons/LogoutIcon.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import MenuOpenedIcon from '$lib/components/icons/MenuOpenedIcon.svelte';
	import type { LayoutData } from './$types';
	import { afterUpdate, onMount } from 'svelte';

	export let data: LayoutData;

	let showMenu = true;
	let windowWidth = 0;
	let loading = true;

	onMount(() => {
		document.querySelectorAll('#menu-items li')?.forEach((item) => {
			item.addEventListener('click', handlerMenuClick);
		});
	});

	afterUpdate(() => {
		document.querySelectorAll('#menu-items li')?.forEach((item) => {
			item.addEventListener('click', handlerMenuClick);
		});
	});

	const handlerMenuClick = () => {
		if (windowWidth < 768) {
			showMenu = !showMenu;
		}
	};

	$: showMenu, windowWidth, loading;
	$: showMenu = windowWidth > 768;
	$: loading = windowWidth === 0;
	$: if (!loading && showMenu) {
		if (windowWidth < 768) {
			document.getElementById('body')!.style.overflow = 'hidden';
		}
	}
	$: if (!loading && !showMenu) {
		console.log('!loading && !showMenu');
		if (windowWidth < 768) {
			document.getElementById('body')!.style.overflow = 'auto';
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if loading}
	<p>carregando</p>
{:else}
	<div class="flex md:h-full bg-slate-100">
		<div
			class="max-sm:fixed max-sm:top-8 max-sm:w-full md:transition-[width] max-sm:h-full transition-opacity duration-500 ease-in-out bg-blue-400"
			class:opacity-0={!showMenu}
			class:opacity-100={showMenu}
			class:-z-50={!showMenu}
			class:z-10={showMenu}
			class:w-0={!showMenu}
		>
			<div class="text-gray-200">
				<div class="p-4">
					<div>
						<div>
							<h1 class="text-xl max-sm:hidden">{data.user.name}</h1>
							<small>{data.user.email}</small>
						</div>
					</div>
				</div>
				<ul id="menu-items" class="py-2">
					<li class="px-4 py-2 hover:bg-blue-500">
						<a href="/">Home</a>
					</li>
					<li class="px-4 py-2 hover:bg-blue-500"><a href="/speakers">Pessoas</a></li>
					<li class="px-4 py-2 hover:bg-blue-500"><a href="/invites">Convites</a></li>
					<li class="px-4 py-2 hover:bg-blue-500">
						<a href="/templates">Templates</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="flex flex-col w-screen ml-0">
			<nav class="w-full max-sm:fixed bg-blue-200">
				<div class="flex justify-between md:p-2">
					<div class="inline-flex gap-2 items-center">
						<button on:click={() => (showMenu = !showMenu)}>
							{#if showMenu}
								<MenuOpenedIcon height="2em" width="2em" />
							{:else}
								<MenuIcon height="2em" width="2em" />
							{/if}
						</button>
						<span class="md:hidden">{data.user.name}</span>
					</div>
					<form method="get" action="/logout">
						<button class="border border-slate-400 rounded p-1" type="submit"
							><LogoutIcon height="2em" width="2em" class="text-slate-700" /></button
						>
					</form>
				</div>
			</nav>

			<!-- Conteúdo principal -->
			<div class="flex p-8">
				<slot />
			</div>
		</div>
	</div>
{/if}

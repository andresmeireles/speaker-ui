<script lang="ts">
	import type { User } from '$lib';
	import { onMount, getContext, getAllContexts } from 'svelte';
	import type { Writable } from 'svelte/store';
	import LogoutIcon from '../icons/LogoutIcon.svelte';
	import MenuIcon from '../icons/MenuIcon.svelte';
	import MenuOpenedIcon from '../icons/MenuOpenedIcon.svelte';

	export let data: { user: User };

	let navRef: HTMLElement;
	const isOutOfViewport = getContext<Writable<boolean>>('navIsOutOfViewport');
	const showMenu = getContext<Writable<boolean>>('showMenu');

	const toggle = () => {
		showMenu.set(!$showMenu);
	};

	onMount(() => {
		const checkViewport = () => {
			const rect = navRef.getBoundingClientRect();

			if (rect.top == -20) {
				isOutOfViewport.set(false);
			}

			const isOut =
				rect.bottom < 0 ||
				rect.right < 0 ||
				rect.left > window.innerWidth ||
				rect.top > window.innerHeight;
			isOutOfViewport.set(isOut);
		};

		checkViewport();
		window.addEventListener('scroll', checkViewport);
		window.addEventListener('resize', checkViewport);

		return () => {
			window.removeEventListener('scroll', checkViewport);
			window.removeEventListener('resize', checkViewport);
		};
	});
</script>

<div
	class="fixed z-20 h-full w-full bg-blue-400 md:hidden"
	class:opacity-0={!$showMenu}
	class:opacity-100={$showMenu}
	class:hidden={!$showMenu}
>
	<div class="text-gray-200">
		<div class="p-4">
			<div class="flex justify-between">
				<div>
					<h1 class="text-xl">{data.user.name}</h1>
					<small>{data.user.email}</small>
				</div>
				<div>
					<button on:click={toggle}>
						{#if $showMenu}
							<MenuOpenedIcon height="2em" width="2em" />
						{:else}
							<MenuIcon height="2em" width="2em" />
						{/if}
					</button>
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
<span bind:this={navRef}></span>
<nav class="z-10 w-full bg-blue-200 p-3" class:fixed={$isOutOfViewport}>
	<div class="flex justify-between">
		<div>
			<button on:click={toggle}>
				{#if $showMenu}
					<MenuOpenedIcon height="2em" width="2em" />
				{:else}
					<MenuIcon height="2em" width="2em" />
				{/if}
			</button>
		</div>
		<div>
			<form method="get" action="/logout">
				<button class="rounded border border-slate-400 p-1" type="submit"
					><LogoutIcon height="2em" width="2em" class="text-slate-700" /></button
				>
			</form>
		</div>
	</div>
</nav>

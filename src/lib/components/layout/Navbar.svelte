<script lang="ts">
	import type { User } from '$lib';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import LogoutIcon from '../icons/LogoutIcon.svelte';
	import MenuIcon from '../icons/MenuIcon.svelte';
	import MenuOpenedIcon from '../icons/MenuOpenedIcon.svelte';

	export let data: { user: User };
	export let menus: { name: string; href: string }[];

	let navRef: HTMLElement;
	let contentRef: HTMLElement;
	const showMenu = getContext<Writable<boolean>>('showMenu');

	const toggle = () => {
		showMenu.set(!$showMenu);
	};
</script>

<div
	class="bg-blue-400 max-sm:fixed max-sm:z-20 max-sm:h-full max-sm:w-full md:hidden"
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
			{#each menus as menu}
				<li class="px-4 py-2 hover:bg-blue-500">
					<a on:click={toggle} href={menu.href}>{menu.name}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<span bind:this={navRef}></span>
<!-- navbar -->
<nav bind:this={contentRef} class="fixed z-10 w-full bg-blue-200 p-3">
	<div class="flex justify-between">
		<div>
			<div class="flex gap-2">
				<button on:click={toggle}>
					{#if $showMenu}
						<MenuOpenedIcon height="2em" width="2em" />
					{:else}
						<MenuIcon height="2em" width="2em" />
					{/if}
				</button>
				<div class="max-sm:hidden">
					<h1 class="text-xl">{data.user.name}</h1>
					<small>{data.user.email}</small>
				</div>
			</div>
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

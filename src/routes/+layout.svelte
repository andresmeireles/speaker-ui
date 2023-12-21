<script lang="ts">
	import '../app.css';
	import LogoutIcon from '../core/icons/LogoutIcon.svelte';
</script>

<div class="bg-blue-800 text-gray-100 w-64 flex flex-col">
	<div class="flex-grow">
		<div class="p-4">
			<div class="flex justify-between">
				<div>Name</div>
				<div><LogoutIcon /></div>
			</div>
		</div>
		<ul class="py-2">
			<li class="px-4 py-2 hover:bg-gray-700">
				<a class="flex" href="/">Home</a>
			</li>
			<li class="px-4 py-2 hover:bg-gray-700"><a class="flex" href="/invites">Convites</a></li>
			<li class="px-4 py-2 hover:bg-gray-700"><a class="flex" href="/templates">Templates</a></li>
		</ul>
	</div>
</div>

<!-- Conteúdo principal -->
<div class="flex-1 p-10">
	<slot />
</div>

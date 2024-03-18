<script lang="ts">
	import Md from '$lib/components/markdown/Markdown.svelte';

	const biroliro = `
  # This is a header

This is a paragraph.

* This is a list
* With two items
  1. And a sublist
  2. That is ordered
    * With another
    * Sublist inside

| And this is | A table |
|-------------|---------|
| With two    | columns |`;
</script>

<div class="flex w-full gap-2">
	<div class="w-1/4">ok</div>
	<div class="w-3/4 bg-slate-200 p-2">
		<div class="bg-white p-1">
			<div style="all: unset">
				<h1 class="remove-all" style="all:initial">Papao</h1>
				<Md source={biroliro} />
			</div>
		</div>
	</div>
</div>

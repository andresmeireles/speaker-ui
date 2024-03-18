<script lang="ts">
	import Markdown from '$lib/components/markdown/Markdown.svelte';
	import { marked } from 'marked';

	let markdown = '';

	const handleFileChange = (e: Event) => {
		const file = event?.target.files[0];

		if (file && file.type === 'text/markdown') {
			const reader = new FileReader();
			reader.onload = (event) => {
				const t = event.target?.result as string;
				// markdown = marked(t);
				markdown = t;
			};

			reader.readAsText(file);
		}
	};

	$: markdown;
</script>

<form>
	<h1>Adicionar novo formulário</h1>
	<input type="file" accept=".md" on:change={handleFileChange} />

	<div class="bg-slate-200 p-2">
		<div class="bg-white p-1">
			<Markdown source={markdown} />
		</div>
	</div>
</form>

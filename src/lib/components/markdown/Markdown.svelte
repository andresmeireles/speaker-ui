<script lang="ts">
	import Heading from './renders/Heading.svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import Strong from './renders/Strong.svelte';
	import Paragraph from './renders/Paragraph.svelte';
	import Table from './renders/Table.svelte';
	import Tablerow from './renders/Tablerow.svelte';
	import Tablecell from './renders/Tablecell.svelte';

	export let source: string;
</script>

<SvelteMarkdown
	bind:source
	renderers={{
		strong: Strong,
		heading: Heading,
		paragraph: Paragraph,
		table: Table,
		tablecell: Tablecell
		// tablerow: Tablerow
		// tablebody: Tablerow,
		// tablehead: Tablerow
	}}
/>

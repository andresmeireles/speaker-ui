<script lang="ts">
	export let depth: number = 0;
	export let text: string;
	export let raw: string;

	const getHeadingClass = () => {
		const levelNumber = depth === 0 ? getHashTags(raw) : depth;

		switch (levelNumber) {
			case 1:
				return 'text-4xl';
			case 2:
				return 'text-3xl';
			case 3:
				return 'text-2xl';
			case 4:
				return 'text-xl';
			case 5:
				return 'text-lg';
			default:
				return 'text-base';
		}
	};

	const getHashTags = (text: string): number => (text.match(/#/g) || []).length;
</script>

<div class={`${getHeadingClass()} mb-2`}>{text}</div>

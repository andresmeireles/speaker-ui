<script>
	import RoundButton from '../../core/components/buttons/RoundButton.svelte';
</script>

<form method="POST">
	<label for="template">Template de convite</label>
	<p class="text-sm">
		Os simbolos <i>{`{name}`}</i> <i>{`{theme}`}</i> <i>{`{time}`}</i> <i>{`{date}`}</i> sempre serao
		subustituidos quando a mensagem for formada
	</p>
	<textarea rows="8" class="form-textarea w-full rounded-xl"></textarea>
	<div class="flex gap-2 justify-center">
		<RoundButton class="w-full bg-blue-800 text-gray-100">Alterar</RoundButton>
	</div>
</form>

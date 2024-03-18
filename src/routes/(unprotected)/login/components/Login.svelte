<script>
	import { enhance } from '$app/forms';
</script>

<div class="flex justify-center">
	<div class="mt-24 w-4/5 rounded-md border border-black bg-slate-200 p-5">
		<h1 class="w-full text-center text-3xl">Login</h1>
		<div class="py-4">
			<form method="POST" action="?/login" use:enhance>
				<input
					type="text"
					name="email"
					placeholder="Email"
					class="mr-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
				/>
				<button class="mt-4 w-full rounded-md bg-blue-500 p-2 text-white">Entrar</button>
			</form>
		</div>
	</div>
</div>

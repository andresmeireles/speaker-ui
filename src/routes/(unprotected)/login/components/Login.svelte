<script>
	import { enhance } from '$app/forms';
</script>

<div class="w-full h-full">
	<div class="flex justify-center">
		<div class="bg-slate-200 w-4/5 p-5 rounded-md mt-24 border-black border">
			<h1 class="text-3xl w-full text-center">Login</h1>
			<div class="py-4">
				<form method="POST" action="?/login" use:enhance>
					<input
						type="text"
						name="email"
						placeholder="Email"
						class="w-full p-2 mr-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
					<button class="rounded-md bg-blue-500 text-white p-2 mt-4 w-full">Entrar</button>
				</form>
			</div>
		</div>
	</div>
</div>

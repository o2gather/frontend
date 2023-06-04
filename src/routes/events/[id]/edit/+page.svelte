<script lang="ts">
	import { isoToDateTimeString } from '../../../../utils';
	import { superValidate, superForm } from 'sveltekit-superforms/client';
	import { schemas } from '../../../../api/api.client';
	import ErrorMessage from '../../../../components/ErrorMessage.svelte';
	import { api } from '../../../../api';
	import { goto } from '$app/navigation';

	export let data;

	const { form, errors, constraints } = superForm(data.form);
	const { event } = data;

	let startTime = isoToDateTimeString(new Date().getTime());
	let endTime = isoToDateTimeString(new Date().getTime());

	$: $form.start_time = new Date(startTime).getTime();
	$: $form.end_time = new Date(endTime).getTime();

	$: {
		// for (let key in $form) {
		// 	($form as unknown as Record<keyof typeof $form, typeof $form>)[key as keyof typeof $form] =
		// 		event[key as keyof typeof $form] as unknown as Record<
		// 			keyof typeof $form,
		// 			typeof $form
		// 		>[keyof Record<keyof typeof $form, typeof $form>];
		// }

		for (const key in $form) {
			$form[key as keyof typeof $form] = event[key as keyof typeof $form] as never;
		}
	}
</script>

<div class="mx-12 mb-12 mt-8 flex flex-col gap-6 md:mx-36">
	<div class="text-4xl font-bold">Edit: {event.name}</div>

	<hr />

	<div class="mt-4 leading-8">
		<form
			method="post"
			class="grid grid-flow-row gap-4"
			on:submit|preventDefault={async () => {
				const result = await superValidate($form, schemas.createEvent_Body);
				if (!result.valid) {
					$errors = result.errors;
					return;
				}

				api
					.updateEvent($form, {
						params: {
							eventId: event.id
						},
						withCredentials: true
					})
					.then((result) => {
						goto(`/events/${result.id}`);
					})
					.catch((error) => {
						console.log(error);
					});
			}}
		>
			<div class="flex flex-col">
				<ErrorMessage message={$errors.category && `A category must be selected.`} />

				<div class="flex">
					<label
						for="search-dropdown"
						class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
					/>
					<input
						class="z-10 inline-flex flex-shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
						list="categories"
						name="category"
						bind:value={$form.category}
						{...$constraints.category}
						placeholder="Select a category"
					/>
					<datalist id="categories">
						{#each data.categories as category}
							<option value={category} />
						{/each}
					</datalist>

					<input
						type="text"
						id="search-dropdown"
						class="z-20 block w-full rounded-r-lg border border-l-2 border-gray-300 border-l-gray-100 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
						placeholder="Event name"
						required
						bind:value={$form.name}
						{...$constraints.name}
						on:input={() => {
							superValidate($form, schemas.createEvent_Body).then((result) => {
								$errors.name = result.errors.name;
							});
						}}
					/>
				</div>

				<ErrorMessage message={$errors.name} />
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
						>Min amount
						<input
							type="number"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Min amount"
							required
							bind:value={$form.min_amount}
							{...$constraints.min_amount}
							on:input={() => {
								superValidate($form, schemas.createEvent_Body).then((result) => {
									$errors.min_amount = result.errors.min_amount;
								});
							}}
						/>

						<ErrorMessage message={$errors.min_amount} />
					</label>
				</div>
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
						>Max amount
						<input
							type="number"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Max amount"
							required
							bind:value={$form.max_amount}
							{...$constraints.max_amount}
							on:input={() => {
								superValidate($form, schemas.createEvent_Body).then((result) => {
									$errors.max_amount = result.errors.max_amount;
								});
							}}
						/>
						<ErrorMessage message={$errors.max_amount} />
					</label>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
						>Start time
						<input
							type="datetime-local"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Start time"
							required
							bind:value={startTime}
							on:input={() => {
								superValidate($form, schemas.createEvent_Body).then((result) => {
									$errors.start_time = result.errors.start_time;
								});
							}}
						/>
						<ErrorMessage message={$errors.start_time} />
					</label>
				</div>
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
						>End time
						<input
							type="datetime-local"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="End time"
							required
							bind:value={endTime}
							on:input={() => {
								superValidate($form, schemas.createEvent_Body).then((result) => {
									$errors.end_time = result.errors.end_time;
								});
							}}
						/>
						<ErrorMessage message={$errors.end_time} />
					</label>
				</div>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Description
					<textarea
						rows="4"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Write your thoughts here..."
						bind:value={$form.description}
					/>
				</label>
			</div>

			<div class="mt-6 flex justify-end">
				<button
					type="submit"
					class=" w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
				>
					Edit
				</button>
			</div>
		</form>
	</div>
</div>
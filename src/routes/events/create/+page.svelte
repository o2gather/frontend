<script lang="ts">
	import { isoToDateTimeString } from '../../../utils';
	import { superValidate, superForm } from 'sveltekit-superforms/client';
	import { schemas } from '../../../api/api.client';
	import ErrorMessage from '../../../components/ErrorMessage.svelte';
	import { api } from '../../../api';
	import { goto } from '$app/navigation';

	export let data;

	const { form, errors, constraints } = superForm(data.form);

	let isDropdownOpen = false;
	let categories = ['Shopping', 'Images', 'News', 'Finance'];

	let startTime = isoToDateTimeString(new Date().getTime());
	let endTime = isoToDateTimeString(new Date().getTime());

	$: $form.start_time = new Date(startTime).getTime();
	$: $form.end_time = new Date(endTime).getTime();
</script>

<div class="mx-12 md:mx-36 mt-8 mb-12 flex flex-col gap-6">
	<div class="font-bold text-4xl">Create Event</div>

	<hr />

	<div class="leading-8 mt-4">
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
					.createEvent($form)
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
						class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
					/>

					<button
						id="dropdown-button"
						on:click={() => (isDropdownOpen = !isDropdownOpen)}
						on:keypress={() => (isDropdownOpen = !isDropdownOpen)}
						class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 dark:border-gray-700 dark:text-white rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
						type="button"
					>
						{$form.category || 'All categories'}
						<svg
							aria-hidden="true"
							class="w-4 h-4 ml-1"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
						<select name="category" required class="pointer-events-none opacity-0">
							<option value={$form.category}>{$form.category}</option>
						</select>
					</button>
					<div
						class="absolute translate-y-[50px] z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
						class:hidden={!isDropdownOpen}
					>
						<ul
							class="py-2 text-sm text-gray-700 dark:text-gray-200"
							aria-labelledby="dropdown-button"
						>
							{#each categories as category (category)}
								<li
									class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
									on:click={() => {
										$form.category = category;
										isDropdownOpen = false;
									}}
									on:keypress={() => {
										$form.category = category;
										isDropdownOpen = false;
									}}
								>
									{category}
								</li>
							{/each}
						</ul>
					</div>

					<div class="relative w-full">
						<input
							type="text"
							id="search-dropdown"
							class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
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
				</div>

				<ErrorMessage message={$errors.name} />
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Min amount
						<input
							type="number"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Max amount
						<input
							type="number"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Start time
						<input
							type="datetime-local"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>End time
						<input
							type="datetime-local"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Description
					<textarea
						rows="4"
						class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Write your thoughts here..."
						bind:value={$form.description}
					/>
				</label>
			</div>

			<div class="flex justify-end mt-6">
				<button
					type="submit"
					class=" w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Create</button
				>
			</div>
		</form>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '../../../api';
	import { auth } from '../../../stores/auth';
	import { isoToDateTimeString } from './../../../utils';
	import { onMount, tick, onDestroy } from 'svelte';
	import Swal from 'sweetalert2';
	import { loggedIn } from '../../../stores/loggedIn';

	let messageDiv: HTMLDivElement;
	let comment: string;

	onMount(() => {
		messageDiv.scrollTop = messageDiv.scrollHeight;
	});

	export let data;
	let { event, messages, userEvents } = data;

	$: startDate = isoToDateTimeString(event.start_time);
	$: endDate = isoToDateTimeString(event.end_time);

	$: isOwner = event.owner?.id === $auth.userId;
	$: isMember = userEvents.some((e) => e.id === event.id);

	$: console.log(event, userEvents);

	const poll = setInterval(() => {
		api
			.getEventMsgs({
				params: { eventId: event.id },
				withCredentials: true
			})
			.then(async (result) => {
				if (messages.length !== result.length) {
					messages = result;
					await tick();
					messageDiv.scrollTop = messageDiv.scrollHeight;
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, 1000);

	onDestroy(() => {
		clearInterval(poll);
	});
</script>

<div class="mx-12 mb-6 mt-8 flex flex-col gap-6 md:mx-36">
	<div class="flex flex-wrap items-center justify-between text-4xl font-bold">
		<div class="flex flex-wrap items-center">
			<div class="mr-4 flex flex-wrap items-center">
				<div class="mr-4">{event.name}</div>
				<div class="text-lg">({event.min_amount} - {event.max_amount} Person)</div>
			</div>
			{#if !isOwner}
				{#if isMember}
					<button
						class="inline-flex cursor-pointer items-center rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
						on:click={() => {
							api.loading
								.leaveEvent(undefined, {
									params: {
										eventId: event.id
									},
									withCredentials: true
								})
								.then(() => {
									userEvents = userEvents.filter((e) => e.id !== event.id);
								})
								.catch((err) => {
									console.log(err);
								});
						}}
					>
						Leave

						<img src="/leave.svg" class="-mr-1 ml-2 h-4 w-4" alt="plus" />
					</button>
				{:else}
					<button
						class="inline-flex cursor-pointer items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
						on:click={() => {
							if ($loggedIn) {
								api.loading
									.joinEvent(
										{
											amount: 1
										},
										{
											params: {
												eventId: event.id
											},
											withCredentials: true
										}
									)
									.then(() => {
										userEvents = [...userEvents, event];
									})
									.catch((err) => {
										console.log(err);
									});
							} else {
								Swal.fire({
									title: 'Login Required',
									text: 'You need to login to join an event',
									icon: 'warning',
									showConfirmButton: false,
									timer: 3000
								});

								window.google.accounts.id.prompt((notification) => {
									if (notification.isNotDisplayed()) {
										document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
										window.google.accounts.id.prompt();
									}
								});
							}
						}}
					>
						Join

						<img src="/plus.svg" class="-mr-1 ml-2 h-4 w-4" alt="plus" />
					</button>
				{/if}
			{/if}
		</div>
		{#if isOwner}
			<div class="ml-auto">
				<a
					class="inline-flex cursor-pointer items-center rounded-lg bg-yellow-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300"
					href={`/events/${event.id}/edit`}
				>
					Edit
				</a>
				<button
					type="button"
					class="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
					on:click={() => {
						Swal.fire({
							title: 'Delete Event',
							text: 'Are you sure you want to delete this event?',
							icon: 'question',
							confirmButtonText: 'Yes',
							confirmButtonColor: 'rgb(185 28 28)',
							cancelButtonText: 'No',
							showCancelButton: true
						}).then((result) => {
							if (result.isConfirmed) {
								api.loading
									.deleteEvent(undefined, {
										params: {
											eventId: event.id
										},
										withCredentials: true
									})
									.then(async () => {
										await tick();
										Swal.fire({
											title: 'Deleted!',
											text: 'Your event has been deleted.',
											icon: 'success',
											confirmButtonText: 'OK'
										});
										goto('/');
									})
									.catch((err) => {
										console.log(err);
									});
							}
						});
					}}
				>
					Delete
				</button>
			</div>
		{/if}
	</div>

	<div class="flex flex-wrap items-center text-gray-700">
		{#if event.members_count !== undefined}
			{#if isOwner && event.members !== undefined}
				<details class="w-full">
					<summary>
						<!-- 判斷如果成團 -->
						{#if event.established}
							Participants: <span class="font-bold">{event.members_count + 1}</span> Person
							<a
								href={`mailto:${event.members.map((member) => member.email).join(',')}`}
								class="m-2 inline-flex cursor-pointer items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
								>Mail to everyone</a
							>
						{:else}
							Participants: <span class="font-bold">{event.members_count + 1}</span> Person
							{#if event.members_count + 1 >= event.min_amount}
								<button
									class="m-2 inline-flex cursor-pointer items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
									on:click={() => {
										Swal.fire({
											title: 'Are you sure about to establish this event?',
											text: 'After the establishment of the event, members will not be able to join or leave.',
											icon: 'question',
											confirmButtonText: 'Yes',
											cancelButtonText: 'No',
											showCancelButton: true
										}).then((result) => {
											if (result.isConfirmed) {
												api.loading
													.updateEvent(
														{
															...event,
															established: true
														},
														{
															params: {
																eventId: event.id
															},
															withCredentials: true
														}
													)
													.then((result) => {
														Swal.fire({
															title: 'Establish success!',
															icon: 'success',
															confirmButtonText: 'OK'
														});

														event = result;
													})
													.catch((err) => {
														console.log(err);
													});
											}
										});
									}}
								>
									Establish
								</button>
							{/if}
						{/if}
					</summary>

					<table class="my-4 w-full text-left text-sm text-gray-500">
						<thead class="bg-gray-50 text-xs uppercase text-gray-700">
							<tr>
								<th scope="col" class="px-6 py-3"> # </th>
								<th scope="col" class="px-6 py-3"> Name </th>
								<th scope="col" class="px-6 py-3"> Email </th>
							</tr>
						</thead>
						<tbody>
							{#each [event.owner, ...event.members] as member, i}
								<tr class="bg-white">
									<td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{i + 1}</td>
									<td class="px-6 py-4">{member?.name}</td>
									<td class="px-6 py-4">
										<a href={`mailto:${member?.email}`} class="text-blue-700">{member?.email}</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</details>
			{/if}
		{/if}
	</div>

	<div class="flex flex-wrap items-center justify-between gap-y-2">
		<div class="text-gray-400">
			{new Date(startDate).toLocaleString()}
			{#if event.end_time}
				- {new Date(endDate).toLocaleString()}
			{/if}
		</div>
		<span class="text-sm font-bold uppercase">
			{#if event.established}
				<div class="text-green-600">Established</div>
			{:else if event.members_count === event.max_amount}
				<div class="text-red-600">Full</div>
			{:else}
				<div class="text-yellow-600">Preparing</div>
			{/if}
		</span>
	</div>

	<div class="border-b border-gray-200" />
</div>

<div class="mx-8 rounded-md border p-4 md:mx-36">
	<h1 class="text-xl font-bold">Organizer</h1>
	<div class="mt-4 flex items-center">
		<img
			class="h-10 w-10 rounded-full bg-gray-200 object-cover object-center"
			src={event.owner?.avatar}
			alt=""
		/>
		<div class="ml-4">
			<div class="text-sm font-medium text-gray-900">
				{event.owner?.name}
			</div>
			<div class="text-sm text-gray-500">
				{event.owner?.email}
			</div>
		</div>
	</div>
</div>

<div class="m-8 grid-cols-[3fr_2fr] gap-16 md:mx-36 xl:grid">
	<div class="mb-4 flex flex-col gap-6">
		<h1 class="text-2xl font-bold">Event Description</h1>
		<div class="whitespace-pre-wrap leading-8">
			{event.description}
		</div>
	</div>
	<div class="rounded-lg px-6 py-8 shadow">
		<h1 class="mb-6 mt-2 text-2xl font-bold">Messages</h1>
		<div
			class="flex h-[calc(100vh-500px)] flex-col items-center overflow-y-scroll"
			bind:this={messageDiv}
		>
			{#each messages as message}
				<div
					class="my-2 flex w-full items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100"
				>
					<div class="flex flex-col items-center justify-center p-2">
						<figure>
							<img
								class="m-2 aspect-square h-20 w-20 rounded-full bg-gray-200 object-cover object-center"
								src={message.user?.avatar}
								alt=""
							/>
							<figcaption class="text-center text-xs text-gray-500">
								{message.user?.name}
							</figcaption>
						</figure>
					</div>
					<div class="m-4 flex-1 whitespace-pre-wrap">
						{message.content}
					</div>
				</div>
			{/each}
		</div>

		{#if isMember || isOwner}
			<div class="mx-auto mb-4 mt-2 flex max-w-3xl flex-col items-center rounded-lg">
				<form
					class="w-full"
					on:submit|preventDefault={() => {
						api.loading
							.createEventMsg(
								{
									content: comment
								},
								{
									params: {
										eventId: event.id
									},
									withCredentials: true
								}
							)
							.then(async (result) => {
								messages = result;
								await tick();
								messageDiv.scrollTop = messageDiv.scrollHeight;
							})
							.catch((error) => {
								console.log(error);
							})
							.finally(() => {
								comment = '';
							});
					}}
				>
					<textarea
						rows="4"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Write your thoughts here..."
						bind:value={comment}
					/>
					<button
						class="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
						type="submit">Comment</button
					>
				</form>
			</div>
		{:else}
			<div class="mx-auto mb-4 mt-2 flex max-w-3xl flex-col items-center rounded-lg">
				<textarea
					rows="4"
					class="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					placeholder="You must be a member to comment"
					disabled
				/>
				<button
					class="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-green-700 bg-opacity-50 px-3 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
					type="submit"
					disabled>Comment</button
				>
			</div>
		{/if}
	</div>
</div>

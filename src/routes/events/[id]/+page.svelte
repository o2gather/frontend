<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '../../../api';
	import { auth } from '../../../stores/auth';
	import { isoToDateTimeString } from './../../../utils';
	import { onMount, tick, onDestroy } from 'svelte';
	import Swal from 'sweetalert2';

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
				<div class="text-lg">({event.min_amount}人 - {event.max_amount}人)</div>
			</div>
			{#if !isOwner}
				{#if isMember}
					<button
						class="inline-flex cursor-pointer items-center rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
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
						class="inline-flex cursor-pointer items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						on:click={() => {
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
					class="inline-flex cursor-pointer items-center rounded-lg bg-yellow-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
					href={`/events/${event.id}/edit`}
				>
					Edit
				</a>
				<button
					type="button"
					class="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
		{#if isOwner}
			<details class="w-full">
				<summary>
					當前參與人數：{event.members_count + 1}人

					{#if event.members_count + 1 >= event.min_amount}
						<button
							class="m-2 inline-flex cursor-pointer items-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							on:click={() => {
								Swal.fire({
									title: '確定成團嗎?',
									text: '成團後成員將無法加入或退出',
									icon: 'question',
									confirmButtonText: 'Yes',
									cancelButtonText: 'No',
									showCancelButton: true
								}).then((result) => {
									if (result.isConfirmed) {
										// api.loading
										// 	.finishEvent(undefined, {
										// 		params: {
										// 			eventId: event.id
										// 		},
										// 		withCredentials: true
										// 	})
										// 	.then(() => {
										Swal.fire({
											title: '成團成功!',
											icon: 'success',
											confirmButtonText: 'OK'
										});
										// })
										// .catch((err) => {
										// 	console.log(err);
										// });
									}
								});
							}}
						>
							成團
						</button>
					{/if}
				</summary>

				<table class="w-full border-collapse">
					<thead>
						<tr>
							<th class="border border-black">#</th>
							<th class="border border-black">姓名</th>
							<th class="border border-black">信箱</th>
						</tr>
					</thead>
					<tbody class="text-center">
						{#each [event.owner, ...event.members] as member, i}
							<tr>
								<td class="border border-black">{i + 1}</td>
								<td class="border border-black">{member.name}</td>
								<td class="border border-black">{member.email}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</details>
		{:else}
			<div>當前參與人數：{event.members_count + 1}人</div>
		{/if}
	</div>

	<div class="text-gray-400">
		{new Date(startDate).toLocaleString()}
		{#if event.end_time}
			- {new Date(endDate).toLocaleString()}
		{/if}
	</div>

	<div class="border-b border-gray-200 dark:border-gray-700" />
</div>

<div class="mx-8 rounded-md border p-4 md:mx-36">
	<h1 class="text-xl font-bold">發起人</h1>
	<div class="flex items-center">
		<img
			class="h-10 w-10 rounded-full bg-gray-200 object-cover object-center"
			src={event.owner.avatar}
			alt=""
		/>
		<div class="ml-4">
			<div class="text-sm font-medium text-gray-900">
				{event.owner.name}
			</div>
			<div class="text-sm text-gray-500">
				{event.owner.email}
			</div>
		</div>
	</div>
</div>

<div class="m-8 grid-cols-[3fr_2fr] gap-16 md:mx-36 xl:grid">
	<div class="mb-4 flex flex-col gap-6">
		<h1 class="text-2xl font-bold">活動內容</h1>
		<div class="whitespace-pre-wrap leading-8">
			{event.description}
		</div>
	</div>
	<div>
		<div
			class="flex h-[calc(100vh-500px)] flex-col items-center overflow-y-scroll"
			bind:this={messageDiv}
		>
			{#each messages as message}
				<div
					class="my-2 flex w-full items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-3xl md:flex-row"
				>
					<div class="flex flex-col items-center justify-center p-2">
						<figure>
							<img
								class="m-2 aspect-square h-20 w-20 rounded-full bg-gray-200 object-cover object-center"
								src={message.user?.avatar}
								alt=""
							/>
							<figcaption class="text-center text-xs text-gray-500 dark:text-gray-400">
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
			<div class="mx-auto mb-4 mt-2 flex max-w-3xl flex-col items-center rounded-lg shadow">
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
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Write your thoughts here..."
						bind:value={comment}
					/>
					<button
						class="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						type="submit">Comment</button
					>
				</form>
			</div>
		{:else}
			<div class="mx-auto mb-4 mt-2 flex max-w-3xl flex-col items-center rounded-lg shadow">
				<textarea
					rows="4"
					class="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
					placeholder="You must be a member to comment"
					disabled
				/>
				<button
					class="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-green-700 bg-opacity-50 px-3 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					type="submit"
					disabled>Comment</button
				>
			</div>
		{/if}
	</div>
</div>

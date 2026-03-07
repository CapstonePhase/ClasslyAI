<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '../convex/_generated/api';
	import type { Id } from '../convex/_generated/dataModel';
	import { Plus, Pencil, Trash2, Check, X } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const tasks = useQuery(api.tasks.list, {});
	const client = useConvexClient();

	let newTodo = $state('');
	let submitting = $state(false);
	let editingId = $state<Id<'tasks'> | null>(null);
	let editingText = $state('');
	let error = $state<string | null>(null);

	async function addTask(e: SubmitEvent) {
		e.preventDefault();
		if (!newTodo.trim() || submitting) return;
		submitting = true;
		error = null;
		try {
			await client.mutation(api.tasks.add, { text: newTodo });
			newTodo = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to add task';
		} finally {
			submitting = false;
		}
	}

	async function toggleTask(id: Id<'tasks'>, done: boolean) {
		error = null;
		try {
			await client.mutation(api.tasks.toggle, { id, done });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update task';
		}
	}

	async function removeTask(id: Id<'tasks'>) {
		error = null;
		try {
			await client.mutation(api.tasks.remove, { id });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete task';
		}
	}

	function startEdit(id: Id<'tasks'>, text: string) {
		editingId = id;
		editingText = text;
		error = null;
	}

	function cancelEdit() {
		editingId = null;
		editingText = '';
	}

	async function saveEdit(id: Id<'tasks'>, done: boolean) {
		if (!editingText.trim()) return;
		error = null;
		try {
			await client.mutation(api.tasks.update, { id, text: editingText, done });
			editingId = null;
			editingText = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update task';
		}
	}

	const completedCount = $derived(tasks.data?.filter((t) => t.done).length ?? 0);
	const totalCount = $derived(tasks.data?.length ?? 0);
</script>

<div class="todo-wrapper">
	<header>
		<h1>To Do</h1>
		{#if totalCount > 0}
			<span class="progress">{completedCount} / {totalCount} done</span>
		{/if}
	</header>

	<form onsubmit={addTask}>
		<input
			bind:value={newTodo}
			type="text"
			placeholder="Add a new task…"
			autocomplete="off"
			disabled={submitting}
		/>
		<Button type="submit" disabled={submitting || !newTodo.trim()}>
			<Plus />
		</Button>
	</form>

	{#if error}
		<p class="error" role="alert">{error}</p>
	{/if}

	{#if tasks.isLoading}
		<p class="state-msg">Loading tasks…</p>
	{:else if tasks.error}
		<p class="state-msg error" role="alert">Failed to load tasks: {tasks.error.message}</p>
	{:else if tasks.data?.length === 0}
		<p class="state-msg empty">No tasks yet — add one above!</p>
	{:else if tasks.data}
		<ul>
			{#each tasks.data as task (task._id)}
				<li class:done={task.done}>
					<input
						id="toggle-{task._id}"
						type="checkbox"
						checked={task.done}
						onchange={(e) => toggleTask(task._id, e.currentTarget.checked)}
					/>

					{#if editingId === task._id}
						<input
							class="edit-input"
							bind:value={editingText}
							onkeydown={(e) => {
								if (e.key === 'Enter') saveEdit(task._id, task.done);
								if (e.key === 'Escape') cancelEdit();
							}}
						/>
						<Button type="button" onclick={() => saveEdit(task._id, task.done)} variant="ghost" title="Save">
							<Check size={16} />
						</Button>
						<Button type="button" onclick={cancelEdit} variant="ghost" title="Cancel">
							<X size={16} />
						</Button>
					{:else}
						<label for="toggle-{task._id}" class:completed={task.done}>{task.text}</label>
						<Button type="button" onclick={() => startEdit(task._id, task.text)} variant="ghost" title="Edit">
							<Pencil size={16} />
						</Button>
						<Button type="button" onclick={() => removeTask(task._id)} variant="ghost" title="Delete">
							<Trash2 size={16} />
						</Button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.todo-wrapper {
		max-width: 480px;
		margin: 2rem auto;
		font-family: inherit;
	}

	header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	h1 {
		margin: 0;
	}

	.progress {
		font-size: 0.875rem;
		color: #6b7280;
	}

	form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	form input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
	}

	form input:disabled {
		opacity: 0.6;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		transition: background 0.15s;
	}

	li.done {
		background: #f9fafb;
	}

	label {
		flex: 1;
		cursor: pointer;
	}

	label.completed {
		text-decoration: line-through;
		color: #9ca3af;
	}

	.edit-input {
		flex: 1;
		padding: 0.25rem 0.5rem;
		border: 1px solid #6366f1;
		border-radius: 0.25rem;
		font-size: 1rem;
		outline: none;
	}

	.state-msg {
		text-align: center;
		color: #6b7280;
		font-size: 0.9rem;
		padding: 1rem 0;
	}

	.error {
		color: #dc2626;
	}

	.empty {
		font-style: italic;
	}
</style>
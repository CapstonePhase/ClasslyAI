<script lang="ts">
	let { initialTodos = [] }: { initialTodos?: string[] } = $props();

	// State
	let todos = $derived(initialTodos.map((t, i) => ({ id: i, text: t, done: false })));
	let inputValue = $state('');

	// Derived
	let remaining = $derived(todos.filter((t) => !t.done).length);

	function addTodo(e: SubmitEvent) {
		e.preventDefault();
		const text = inputValue.trim();
		if (!text) return;

		todos.push({ id: Date.now(), text, done: false });
		inputValue = '';
	}

	function removeTodo(id: number) {
		const index = todos.findIndex((t) => t.id === id);
		if (index !== -1) todos.splice(index, 1);
	}
</script>

<div class="todo-widget">
	<div class="header">
		<h3>Tasks</h3>
		<span class="badge">{remaining} pending</span>
	</div>

	<form onsubmit={addTodo} class="input-group">
		<input type="text" bind:value={inputValue} placeholder="Add a new task..." />
		<button type="submit" disabled={!inputValue.trim()}>+</button>
	</form>

	<ul class="list">
		{#each todos as todo (todo.id)}
			<li class:done={todo.done}>
				<label>
					<input type="checkbox" bind:checked={todo.done} />
					<span>{todo.text}</span>
				</label>
				<button class="delete-btn" onclick={() => removeTodo(todo.id)} aria-label="Delete">×</button
				>
			</li>
		{/each}
		{#if todos.length === 0}
			<li class="empty">All caught up!</li>
		{/if}
	</ul>
</div>

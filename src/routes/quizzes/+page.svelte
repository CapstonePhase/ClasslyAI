<h1>QUIZ</h1>

<ul id="tabs">
	<li>Questions</li>
	<li>Result</li>
</ul>

<form>
	<div class="questions">
		<h3>This is Question 1</h3>
		<p>Responses</p>
		<ul>
			<li>Option1</li>
			<li>Option2</li>
			<li>Option3</li>
			<li>Option4</li>
		</ul>
		<p>Pop Quiz</p>
	</div>

	<div class="questions">
		<h3>This is Question 2</h3>
		<p>Responses</p>
		<input type="text" placeholder="Type your answer here" />
		<p>Pop Quiz</p>
	</div>
</form>

<style>
	.questions {
		border: 1px solid var(--border);
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 1rem;
	}

	#tabs {
		list-style: none;
		gap: 1rem;
		display: flex;
		padding: 0;
		margin: 0;
	}
</style>

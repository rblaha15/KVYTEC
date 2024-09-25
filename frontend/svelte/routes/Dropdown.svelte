<script lang="ts" generics="T extends readonly string[]">
	export let values: T;
	export let value: T[number];
	export let show: boolean = true;
</script>

{#if show}
	<label class="form-label d-block">
		<slot />
		<div class="dropdown">
			<button
				class="btn text-body bg-body border dropdown-toggle"
				type="button"
				data-bs-toggle="dropdown">{value}</button
			>
			<ul class="dropdown-menu">
				{#each values as item}
					<li>
						<button class="dropdown-item" on:click={() => (value = item)}>{item}</button>
					</li>
				{/each}
			</ul>
		</div>
	</label>
{/if}

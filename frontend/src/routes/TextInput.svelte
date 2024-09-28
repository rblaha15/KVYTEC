<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let value: string | null = null; // Initialize with null
	export let units: string | null = null;
	export let show: boolean = true;

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		value = target.value; // Update local value
		dispatch('input', value); // Emit the event with the new value
	};
</script>

{#if show}
	<label class="d-flex">
		<label class="form-label">
			<slot />
			<div class="input-group">
				<input type="text" class="form-control border-end-0" bind:value on:input={handleInput} />
				{#if units != null}
					<span class="input-group-text border-start-0">{units}</span>
				{/if}
			</div>
		</label>
	</label>
{/if}

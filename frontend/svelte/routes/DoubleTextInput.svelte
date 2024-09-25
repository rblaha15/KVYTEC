<script lang="ts">
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let value1: string | null = '';
export let value2: string | null = '';
export let show: boolean = true;
export let units: string | null = null;

const handleInput1 = (event: Event) => {
    value1 = (event.target as HTMLInputElement).value;
    dispatch('input1', { detail: value1, detail2: value2 }); // Pass detail2 as well
};

const handleInput2 = (event: Event) => {
    value2 = (event.target as HTMLInputElement).value;
    dispatch('input2', { detail: value1, detail2: value2 }); // Pass detail as well
};

</script>

{#if show}
	<div class="d-flex">
		<label class="form-label">
			<slot />
			<div class="input-group">
				<input type="text" class="form-control border-end-0" bind:value={value1} on:input={handleInput1} />
				<input type="text" class="form-control border-end-0" bind:value={value2} on:input={handleInput2} />
				{#if units != null}
					<span class="input-group-text">{units}</span>
				{/if}
			</div>
		</label>
	</div>
{/if}

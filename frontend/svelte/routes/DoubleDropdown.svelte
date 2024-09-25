<script lang="ts" generics="T1 extends readonly string[], T2 extends readonly string[]">
	export let value1: T1[number];
	export let value2: T2[number];
	export let values1: T1;
	export let values2: T2;
	export let show: boolean = true;
	export let units: string | null = null;
</script>

{#if show}
	<label for="" class="form-label">
		<slot />
		<div class="d-flex flex-nowrap">
			<div>
				<input type="text" class="form-control h-0 py-0 my-0 border-0" />
				<button
					class="btn btn-outline-secondary text-body bg-body border border-end-0 text-start dropdown-toggle w-100"
					type="button"
					style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
					data-bs-toggle="dropdown"
				>
					{value1}</button
				>
				<ul class="dropdown-menu">
					{#each values1 as item}
						<li>
							<button class="dropdown-item" on:click={() => (value1 = item)}>{item}</button>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<input type="text" class="form-control h-0 py-0 my-0 border-0" />
				<button
					class="btn btn-outline-secondary text-body bg-body border text-start dropdown-toggle w-100"
					style="border-top-left-radius: 0; border-bottom-left-radius: 0; {units != null
						? 'border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 0 !important;'
						: ''}"
					type="button"
					data-bs-toggle="dropdown">{value2}</button
				>
				<ul class="dropdown-menu">
					{#each values2 as item}
						<li>
							<button class="dropdown-item" on:click={() => (value2 = item)}>{item}</button>
						</li>
					{/each}
				</ul>
			</div>
			{#if units != null}
				<div>
					<p class="px-2-5 invisible py-0 my-0 h-0">kWh</p>
					<span
						class="input-group-text"
						style="border-top-left-radius: 0; border-bottom-left-radius: 0;">{units}</span
					>
				</div>
			{/if}
		</div>
	</label>
{/if}

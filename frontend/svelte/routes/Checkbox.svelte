<script lang="ts">
    export let value: boolean
</script>

<div class="form-check mb-2">
    <label class="form-check-label">
        <input class="form-check-input" bind:checked={value} type="checkbox" {...$$restProps}>
        <slot />
    </label>
</div>
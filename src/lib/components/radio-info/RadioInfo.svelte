<script lang="ts">
	import { Avatar } from "@dxdns/feflow-svelte"
	import type { HTMLAttributes } from "svelte/elements"

	interface Props extends HTMLAttributes<HTMLDivElement> {
		name?: string
		image?: string
		width?: string
		height?: string
		fontSize?: string
	}

	let {
		name,
		image,
		width,
		height,
		fontSize = "auto",
		...rest
	}: Props = $props()
</script>

<div class="radioInfo" style={rest.style}>
	<div style="flex-shrink: 0;">
		<Avatar {width} {height} textFallback={name ?? "?"} src={image} />
	</div>
	{#if name}
		<h2
			style="
			width: 100%;
			white-space: nowrap; 
			overflow: hidden; 
			text-overflow: ellipsis;
			text-align: center;
			font-size: {fontSize};
			"
		>
			{name}
		</h2>
	{:else}
		<small class="muted">No station selected</small>
	{/if}
</div>

<style>
	.radioInfo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		justify-content: center;
	}

	@media screen and (max-width: 425px) {
		.radioInfo {
			width: 200px;
		}
	}
</style>

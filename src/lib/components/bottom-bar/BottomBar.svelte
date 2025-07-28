<script lang="ts">
	import { onDestroy, type Snippet } from "svelte"
	import { Card, useMediaQuery } from "@dxdns/feflow-svelte"

	interface Props {
		children: Snippet<[]>
	}

	let { children }: Props = $props()

	const isSm = $derived(useMediaQuery("max-width", "sm"))
	const isMd = $derived(useMediaQuery("max-width", "md"))

	onDestroy(() => {
		isSm.destroy()
		isMd.destroy()
	})
</script>

<Card
	isTranslucent
	style="
    position: fixed;
    bottom: 0;
    height: {isSm.value ? '150px' : isMd.value ? '100px' : '40px'};
    left: 0;
    right: 0;
    z-index: 999;
    padding: 1rem;
	display: flex;
"
>
	<div
		style="
		display: flex;
		align-items: center;
		justify-content: {isMd.value ? 'center' : 'space-between'};
		flex-wrap: wrap;
		gap: 1rem;
		margin: 0 auto;
		"
	>
		{@render children?.()}
	</div>
</Card>

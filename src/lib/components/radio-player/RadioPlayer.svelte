<script lang="ts">
	import { Card, Separator, useMediaQuery } from "@dxdns/feflow-svelte"
	import { onDestroy, type Snippet } from "svelte"
	import { RadioControls } from "../radio-controls"

	interface Props {
		isPlaying: boolean
		volume: number
		handleClick?: () => void
		radioInfo: Snippet<[]>
		children: Snippet<[]>
	}

	let {
		isPlaying,
		volume = $bindable(0),
		handleClick,
		radioInfo,
		children
	}: Props = $props()

	const isMd = $derived(useMediaQuery("max-width", "md"))

	onDestroy(() => {
		isMd.destroy()
	})
</script>

<Card
	variant="contained"
	style="
    min-height: 100vh; 
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
	align-items: {isMd.value ? 'center' : 'stretch'};
    "
>
	{@render radioInfo?.()}
	<RadioControls bind:volume {isPlaying} {handleClick} />
	<Separator />
	{@render children?.()}
</Card>

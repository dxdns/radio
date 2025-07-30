<script lang="ts">
	import { Card, Separator, useMediaQuery } from "@dxdns/feflow-svelte"
	import { onDestroy, type Snippet } from "svelte"
	import { ControlPlay } from "../control-play"
	import { ControlAudio } from "../control-audio"
	import { ControlCast } from "../control-cast"
	import { ControlInfo } from "../control-info"

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
	<div
		style="
		display: flex; 
		gap: 1rem; 
		justify-content: center; 
		flex-wrap: wrap;
		"
	>
		<ControlCast />
		<ControlPlay {isPlaying} {handleClick} />
		<ControlInfo />
		<ControlAudio bind:volume />
	</div>
	<Separator />
	{@render children?.()}
</Card>

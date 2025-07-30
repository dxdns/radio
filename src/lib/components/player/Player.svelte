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
		radioInfo?: Snippet<[]>
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
	const isSm = $derived(useMediaQuery("max-width", "sm"))

	onDestroy(() => {
		isMd.destroy()
		isSm.destroy()
	})
</script>

<Card
	variant="contained"
	style="
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
	align-items: {isMd.value ? 'center' : 'stretch'};

	{isSm.value &&
		`
		position: fixed;
		z-index: 1;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		padding-top: 8rem;
		border-radius: 0;
		padding-bottom: 2rem;
		background: var(--ff-surface);
		`}
    "
>
	{#if !isMd.value}
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
	{/if}
	{@render children?.()}
</Card>

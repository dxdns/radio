<script lang="ts">
	import { Navbar, useMediaQuery } from "@dxdns/feflow-svelte"
	import { onDestroy } from "svelte"
	import { Info } from "../info"
	import { ControlPlay } from "../control-play"
	import { ControlAudio } from "../control-audio"

	interface Props {
		name?: string
		image?: string
		isPlaying: boolean
		volume: number
		handleClick?: () => void
	}

	let {
		name,
		image,
		isPlaying,
		volume = $bindable(0),
		handleClick
	}: Props = $props()

	const isSm = $derived(useMediaQuery("max-width", "sm"))
	const isLg = $derived(useMediaQuery("min-width", "lg"))

	onDestroy(() => {
		isSm.destroy()
		isLg.destroy()
	})
</script>

<Navbar
	style="
	position: fixed; 
	bottom: 0; 
	z-index: 999; 
	height: 40px; 
	box-shadow: 0 0 10px rgba(0,0,0,0.1);
	left: 0;
    right: 0;
	background: color-mix(in srgb, var(--ff-surface), black 10%);
	"
>
	<div style="flex: 1;"></div>
	<div
		style="
		display: flex; 
		gap: 1rem; 
		align-items: center; 
		justify-content: center;
		"
	>
		<Info
			{name}
			{image}
			fontSize="13px;"
			style="flex-direction: row;"
			width="34px"
			height="34px"
		/>
		<ControlPlay {isPlaying} {handleClick} />
	</div>
	<div style="flex: 1;"></div>
	{#if isLg.value}
		<ControlAudio bind:volume />
	{/if}
</Navbar>

<script lang="ts">
	import { BottomSheet, useMediaQuery } from "@dxdns/feflow-svelte"
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

	onDestroy(() => {
		isSm.destroy()
	})
</script>

<BottomSheet
	isOpen={true}
	handleClose={() => {}}
	style="
	min-height: {isSm.value ? '10vh' : '5vh'}; 
	height: {isSm.value ? '10vh' : '5vh'}; 
	max-height: {isSm.value ? '30vh' : '5vh'};
	"
>
	<div
		style="
		display: flex; 
		justify-content: center; 
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		"
	>
		<div
			style="
			position: absolute;
			top: 50%;
			transform: translate(0, {isSm.value ? '-10%' : '-50%'});
			left: 15px;
			right: 15px;
			z-index: {isSm.value ? '-1' : '1'};
			"
		>
			<div
				style="
				display: flex; 
				gap: 1rem; 
				align-items: center; 
				justify-content: {isSm.value ? 'center' : 'space-around'};
				flex-wrap: wrap;
				"
			>
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
						width="38px"
						height="38px"
					/>
					<ControlPlay {isPlaying} {handleClick} />
				</div>
				<ControlAudio bind:volume />
			</div>
		</div>
	</div>
</BottomSheet>

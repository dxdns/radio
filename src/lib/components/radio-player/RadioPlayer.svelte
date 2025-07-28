<script lang="ts">
	import {
		Avatar,
		Button,
		Card,
		RangeInput,
		Separator
	} from "@dxdns/feflow-svelte"
	import type { Snippet } from "svelte"

	interface Props {
		name?: string
		image?: string
		isPlaying: boolean
		volume: number
		isVolumeOff: boolean
		handleClick?: () => void
		children: Snippet<[]>
	}

	let {
		name,
		image,
		isPlaying,
		volume,
		isVolumeOff,
		handleClick,
		children
	}: Props = $props()
</script>

<Card
	variant="contained"
	style="
    min-height: 100vh; 
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    "
>
	<div
		style="
        display: flex; 
        flex-direction: column; 
        align-items: center;
        gap: 1rem;
        "
	>
		<Avatar
			width="150px"
			height="150px"
			textFallback={name ?? "?"}
			src={image}
		/>
		<h2
			style="
            width: 100%; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
            text-align: center;
            "
		>
			{name}
		</h2>
		<div style="display: flex; gap: 1rem;">
			<Button roundedFull disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
				>
					<path
						d="M480-480Zm320 320H600q0-20-1.5-40t-4.5-40h206v-480H160v46q-20-3-40-4.5T80-680v-40q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160Zm-720 0v-120q50 0 85 35t35 85H80Zm200 0q0-83-58.5-141.5T80-360v-80q117 0 198.5 81.5T360-160h-80Zm160 0q0-75-28.5-140.5t-77-114q-48.5-48.5-114-77T80-520v-80q91 0 171 34.5T391-471q60 60 94.5 140T520-160h-80Z"
					/>
				</svg>
			</Button>
			<Button roundedFull onclick={handleClick}>
				{#if isPlaying}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="currentColor"
					>
						<path
							d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="currentColor"
					>
						<path
							d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"
						/>
					</svg>
				{/if}
			</Button>
			<Button roundedFull disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
				>
					<path
						d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
					/>
				</svg>
			</Button>
		</div>
		<div style="display: flex; align-items: center;">
			<Button
				variant="text"
				style="padding: 0;"
				onclick={() => {
					isVolumeOff = !isVolumeOff
				}}
			>
				{#if isVolumeOff}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="currentColor"
					>
						<path
							d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="currentColor"
					>
						<path
							d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"
						/>
					</svg>
				{/if}
			</Button>
			<RangeInput bind:value={volume} min={0} max={100} step={10} />
		</div>
	</div>
	<Separator />
	{@render children?.()}
</Card>

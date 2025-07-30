<script lang="ts">
	import { Button } from "@dxdns/feflow-svelte"

	interface Props {
		isPlaying: boolean
		handleClick?: () => void
	}

	let { isPlaying, handleClick }: Props = $props()
</script>

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

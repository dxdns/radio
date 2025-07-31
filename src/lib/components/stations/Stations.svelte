<script lang="ts">
	import type { StationsType } from "@/types"
	import {
		Avatar,
		Badge,
		Card,
		Skeleton,
		VisibilityListener
	} from "@dxdns/feflow-svelte"

	interface Props {
		currentId: string
		data: StationsType[]
		isLoading: boolean
		isPlaying: boolean
		limit: number
		handleClick: () => void
	}

	let {
		currentId = $bindable(""),
		data,
		isLoading,
		isPlaying,
		limit = $bindable(0),
		handleClick
	}: Props = $props()

	let hasTriggered = $state(false)

	function handleMoreLimit() {
		limit += 5
		setTimeout(() => {
			hasTriggered = false
		}, 1000)
	}
</script>

<div class="container">
	<div
		style="
		display: grid; 
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
		gap: 1rem;
		"
	>
		{#each data as { name, favicon, stationuuid, tags } (stationuuid)}
			{@const newName = name.replace(/^\./, "")}
			{@const isActive = currentId === stationuuid && isPlaying}
			<Skeleton {isLoading} variant="pulse" style="height: 80px;">
				<Card
					animatedBorder={isActive && {
						width: "5px"
					}}
					variant="contained"
					style="
					margin: 0;
					display: flex; 
					flex-direction: column; 
					align-items: center;
					justify-content: center;
					cursor: pointer;
					gap: 1rem;
					"
					onclick={() => {
						currentId = stationuuid
						handleClick()
					}}
				>
					<div
						style="
						display: flex; 
						align-items: center; 
						gap: 0.5rem; 
						width: 100%; 
						justify-content: center;
				"
					>
						<Avatar textFallback={newName} src={favicon} />
						<p
							style="
							flex: 1;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							margin: 0;
					"
						>
							{newName}
						</p>
					</div>
					{#if tags !== ""}
						<div
							style="
							display: flex; 
							gap: 0.5rem; 
							align-items: center;
							flex-wrap: wrap;
							"
						>
							{#each tags.split(",").slice(0, 2) as tag (tag)}
								<Badge>{tag}</Badge>
							{/each}
						</div>
					{/if}
				</Card>
			</Skeleton>
		{/each}
	</div>

	<VisibilityListener
		callback={() => {
			if (hasTriggered) return
			hasTriggered = true
			handleMoreLimit()
		}}
	/>
</div>

<style>
	.container {
		max-height: 60vh;
		overflow-y: auto;
		padding: 1rem;
		box-sizing: border-box;
		width: 100%;
	}

	@media screen and (max-width: 425px) {
		.container {
			max-height: 100%;
		}

		.container::-webkit-scrollbar {
			display: none;
		}
	}
</style>

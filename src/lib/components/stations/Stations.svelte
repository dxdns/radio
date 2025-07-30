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

<div
	style="
	max-height: 60vh;
	overflow-y: scroll;
	padding: 1rem 1rem 1rem 0;
    box-sizing: border-box;
	"
>
	<div
		style="
		display: grid; 
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
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
					"
					onclick={() => {
						currentId = stationuuid
						handleClick()
					}}
				>
					<Avatar textFallback={newName} src={favicon} />
					<p
						style="
						width: 100%; 
						white-space: nowrap; 
						overflow: hidden; 
						text-overflow: ellipsis;
						text-align: center;
						"
					>
						{newName}
					</p>
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

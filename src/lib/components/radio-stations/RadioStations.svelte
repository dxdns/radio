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
		id?: string
		data: StationsType[]
		isLoading: boolean
		isPlaying: boolean
		handleClick?: (id: string) => void
		handleMoreLimit: () => void
	}

	let { id, data, isLoading, isPlaying, handleClick, handleMoreLimit }: Props =
		$props()
</script>

<div
	style="
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
    gap: 1rem;
    max-height: 320px;
    overflow-y: scroll;
    padding: 1rem 1rem 1rem 0;
    "
>
	{#each data as { name, favicon, stationuuid, tags } (stationuuid)}
		{@const newName = name.replace(/^\./, "")}
		<Skeleton {isLoading} variant="pulse" style="height: 80px;">
			<Card
				animatedBorder={id === stationuuid && isPlaying}
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
					handleClick?.(stationuuid)
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
	<VisibilityListener callback={handleMoreLimit} />
</div>

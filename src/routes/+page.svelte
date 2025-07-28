<script lang="ts">
	import { BottomBar } from "@/components/bottom-bar"
	import { RadioControls } from "@/components/radio-controls/index.js"
	import { RadioInfo } from "@/components/radio-info/index.js"
	import { RadioPlayer } from "@/components/radio-player/index.js"
	import { RadioStations } from "@/components/radio-stations/index.js"
	import apiService from "@/services/apiService.js"
	import type { CountryCodeType, StationsType } from "@/types"
	import { Button, Card, SearchInput, Select } from "@dxdns/feflow-svelte"
	import { onDestroy } from "svelte"

	let { data } = $props()

	const api = apiService()

	let isLoading = $state(true)
	let result: StationsType[] = $state([])
	let countryCode: CountryCodeType = $state("BR")
	let limit = $state(12)
	let searchInputValue = $state("")
	let currentStationuuid = $state("")
	let currentUrl = $state("")
	let volume = $state(50)
	let audio: HTMLAudioElement | null = $state(null)
	let isPlaying = $state(false)

	const currentStation = $derived(
		result.find((v) => v.stationuuid === currentStationuuid)
	)

	function reset() {
		if (audio) {
			audio.pause()
			audio = null
		}
	}

	function play() {
		if (audio) {
			audio.play()
			isPlaying = true
		}
	}

	function pause() {
		if (audio) {
			audio.pause()
			isPlaying = false
		}
	}

	function playSound() {
		if (!currentStation) return
		const url = currentStation.url_resolved

		function setAudio() {
			audio = new Audio(url)
			currentUrl = url
			play()
		}

		if (!audio) {
			setAudio()
			return
		}

		if (url && url !== currentUrl) {
			reset()
			setAudio()
			return
		}

		if (isPlaying) {
			pause()
		} else {
			play()
		}
	}

	async function fetchData() {
		isLoading = true
		try {
			const response = await api.get(limit, countryCode, searchInputValue)
			if (!response.ok) throw new Error("error")
			result = await response.json()
		} finally {
			isLoading = false
		}
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		searchInputValue = String(formData.get("searchInputValue") || "")
		await fetchData()
	}

	$effect(() => {
		fetchData()
	})

	$effect(() => {
		if (audio) {
			audio.volume = volume / 100
		}
	})

	onDestroy(() => {
		reset()
	})
</script>

<svelte:head>
	<title>Radio | {data.title}</title>
</svelte:head>

<BottomBar>
	<RadioInfo
		name={currentStation?.name}
		image={currentStation?.favicon}
		fontSize="13px;"
		style="flex-direction: row;"
		width="48px"
		height="48px"
	/>
	<RadioControls bind:volume {isPlaying} handleClick={playSound} />
</BottomBar>

<div class="container">
	<header
		style="
		display: flex; 
		flex-direction: column; 
		gap: 1rem;
		"
	>
		<h1>Radio 📻</h1>
		<form onsubmit={handleSubmit}>
			<SearchInput
				id="searchInputValue"
				name="searchInputValue"
				variant="outlined"
				placeholder={"Search stations..."}
				oninput={(e) => {
					if (e.currentTarget.value === "") {
						searchInputValue = ""
					}
				}}
			/>
		</form>
		<Card
			style="
			display: flex; 
			justify-content: center; 
			align-items: center;
			background: color-mix(in srgb, rgb(134, 94, 60) 70%, white);
			padding: 2rem;
			"
		>
			<h2 style="margin: 0;">Discover over 50,000 public stations</h2>
		</Card>
	</header>

	<main>
		<label for="country" style="display: flex; align-items: center; gap: 1rem;">
			Country:
			<Select
				id="country"
				onchange={(e) => {
					const { value } = e.currentTarget
					countryCode = value as CountryCodeType
				}}
			>
				<option value="BR">Brazil</option>
				<option value="US">EUA</option>
			</Select>
		</label>
		<br />

		<RadioPlayer
			{isPlaying}
			bind:volume
			handleClick={() => {
				playSound()
			}}
		>
			{#snippet radioInfo()}
				<RadioInfo
					name={currentStation?.name}
					image={currentStation?.favicon}
					width="150px"
					height="150px"
				/>
			{/snippet}
			<RadioStations
				bind:currentId={currentStationuuid}
				data={result}
				{isLoading}
				{isPlaying}
				bind:limit
				handleClick={playSound}
			/>
		</RadioPlayer>
	</main>
</div>

<style>
	.container {
		width: 80%;
		margin: 3rem auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media screen and (max-width: 768px) {
		.container {
			width: 90%;
		}
	}
</style>

<script lang="ts">
	import { RadioPlayer } from "@/components/radio-player/index.js"
	import { RadioStations } from "@/components/radio-stations/index.js"
	import apiService from "@/services/apiService.js"
	import type { CountryCodeType, StationsType } from "@/types"
	import { Card, SearchInput, Select } from "@dxdns/feflow-svelte"
	import { onDestroy } from "svelte"

	let { data } = $props()

	const api = apiService()

	let isLoading = $state(true)
	let result: StationsType[] = $state([])
	let countryCode: CountryCodeType = $state("BR")
	let limit = $state(21)
	let searchInputValue = $state("")
	let currentStationuuid = $state("")
	let isVolumeOff = $state(false)
	let volume = $state(50)
	let audio: HTMLAudioElement | null = $state(null)
	let isPlaying = $state(false)

	const currentStation = $derived(
		result.find((v) => v.stationuuid === currentStationuuid)
	)

	function playSound() {
		if (!audio) {
			audio = new Audio(currentStation?.url_resolved)
			audio.play()
			isPlaying = true
		} else if (
			currentStation &&
			audio.currentSrc !== currentStation.url_resolved
		) {
			audio.src = currentStation?.url_resolved
			audio.play()
			isPlaying = true
		} else if (audio.paused) {
			audio.play()
			isPlaying = true
		} else {
			audio.pause()
			isPlaying = false
		}
	}

	async function fetchData() {
		isLoading = true
		try {
			const response = await api.get(limit, countryCode, searchInputValue)
			if (!response.ok) return
			result = await response.json()
		} catch (err) {
			console.error("Erro ao buscar estações:", err)
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

	onDestroy(() => {
		audio?.pause()
		audio = null
	})
</script>

<svelte:head>
	<title>Radio | {data.title}</title>
</svelte:head>

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
		<div
			style="
			display: grid; 
			grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
			gap: 1rem;
			align-items: flex-start;
			"
		>
			<RadioStations
				id={currentStation?.stationuuid}
				data={result}
				{isLoading}
				{isPlaying}
				handleMoreLimit={() => {
					limit += 5
				}}
				handleClick={(id) => {
					currentStationuuid = id
					playSound()
				}}
			/>

			<RadioPlayer
				name={currentStation?.name}
				image={currentStation?.favicon}
				{isPlaying}
				{isVolumeOff}
				{volume}
				handleClick={() => {
					playSound()
				}}
			/>
		</div>
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

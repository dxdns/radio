<script lang="ts">
	import { ControlBar } from "@/components/control-bar"
	import { Info } from "@/components/info/index.js"
	import { Player } from "@/components/player/index.js"
	import { Stations } from "@/components/stations/index.js"
	import apiService from "@/services/apiService.js"
	import type { CountryCodeType, StationsType } from "@/types/index.js"
	import {
		Card,
		Navbar,
		SearchInput,
		Select,
		useMediaQuery
	} from "@dxdns/feflow-svelte"
	import { onDestroy } from "svelte"

	let { data } = $props()

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

	const api = apiService()
	const isSm = $derived(useMediaQuery("max-width", "sm"))

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
		isSm.destroy()
	})
</script>

<svelte:head>
	<title>Radio | {data.title}</title>
</svelte:head>

<ControlBar
	name={currentStation?.name}
	image={currentStation?.favicon}
	{isPlaying}
	bind:volume
	handleClick={playSound}
/>

<div class="container">
	<h1>Radio 📻</h1>

	<Navbar
		style="
		position: {isSm.value ? 'fixed' : 'sticky'};
		top: 0;
		left: 0;
		right: 0;
		z-index: 900;
		border-radius: {isSm.value ? '0' : '15px'};
		height: auto;
		padding: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
		background: color-mix(in srgb, var(--ff-surface), black 10%);
		{!isSm.value && 'box-shadow: 0 0 10px rgba(0,0,0,0.1);'}
		"
	>
		<form
			onsubmit={handleSubmit}
			style="width: {isSm.value ? '100%' : 'auto'};"
		>
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

		<div style="flex: 1;"></div>

		<label
			class="muted"
			for="country"
			style="display: flex; align-items: center; gap: 1rem;"
		>
			<small>Country:</small>
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
	</Navbar>

	{#if !isSm.value}
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
	{/if}

	<main>
		<Player
			{isPlaying}
			bind:volume
			handleClick={() => {
				playSound()
			}}
		>
			{#snippet radioInfo()}
				<Info
					name={currentStation?.name}
					image={currentStation?.favicon}
					width="150px"
					height="150px"
				/>
			{/snippet}

			<Stations
				bind:currentId={currentStationuuid}
				data={result}
				{isLoading}
				{isPlaying}
				bind:limit
				handleClick={playSound}
			/>
		</Player>
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
